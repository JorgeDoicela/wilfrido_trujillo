import { useState, useEffect } from 'react';
import {
  Clock,
  XCircle,
  ArrowRight,
  RotateCcw,
  Lock,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { testsApi } from '../api/tests.api';
import type { Test, TestResult } from '@/shared/types/test.types';

interface QuestionnaireTestProps {
  test: Test;
  inductionWatched: boolean;
  onTestPassed?: (result: TestResult) => void;
  onProceedToResources?: () => void;
}

export function QuestionnaireTest({
  test,
  inductionWatched,
  onTestPassed,
  onProceedToResources,
}: QuestionnaireTestProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(
    test.timeLimitMinutes ? test.timeLimitMinutes * 60 : null,
  );

  useEffect(() => {
    if (timeLeft === null || result !== null) return;

    if (timeLeft <= 0) {
      handleSubmitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, result]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setErrorMessage(null);
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < test.questions.length) {
      setErrorMessage(
        `Has respondido ${answeredCount} de ${test.questions.length} preguntas. Completa todas antes de entregar.`,
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await testsApi.submit(test.id, selectedAnswers);
      setResult(res);

      if (res.passed && onTestPassed) {
        onTestPassed(res);
      }
    } catch {
      let correct = 0;
      test.questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctOptionIndex) {
          correct++;
        }
      });
      const score = Math.round((correct / test.questions.length) * 10 * 10) / 10;
      const passed = score >= test.passingScore;

      const fallbackResult: TestResult = {
        attemptId: 'demo-test-attempt',
        scoreObtained: score,
        passingScore: test.passingScore,
        passed,
        correctCount: correct,
        totalQuestions: test.questions.length,
        completedAt: new Date().toISOString(),
      };

      setResult(fallbackResult);
      if (passed && onTestPassed) {
        onTestPassed(fallbackResult);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    setErrorMessage(null);
    setTimeLeft(test.timeLimitMinutes ? test.timeLimitMinutes * 60 : null);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!inductionWatched) {
    return (
      <div className="p-8 text-center bg-[#fafafa] rounded-lg border border-[#e0e0e0] max-w-2xl mx-auto">
        <div className="text-[#7d5a00] flex items-center justify-center mx-auto mb-2">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-semibold text-[#242424] mb-1">Evaluación Normativa Bloqueada</h3>
        <p className="text-xs text-[#616161] max-w-md mx-auto leading-relaxed">
          Para rendir este examen es obligatorio haber visto el video de inducción al 100%. Completa la visualización previa en el reproductor.
        </p>
      </div>
    );
  }

  // Pantalla de Resultados Microsoft Forms style
  if (result) {
    return (
      <div className="p-6 max-w-2xl mx-auto bg-white border border-[#e0e0e0] rounded-lg shadow-xs">
        <div className="text-center mb-5">
          <div
            className={`flex items-center justify-center mx-auto mb-3 ${
              result.passed ? 'text-[#107c10]' : 'text-[#a4262c]'
            }`}
          >
            {result.passed ? <Award className="w-9 h-9" /> : <XCircle className="w-9 h-9" />}
          </div>

          <span
            className={`m365-badge ${
              result.passed ? 'm365-badge--success' : 'm365-badge--danger'
            } text-xs mb-2`}
          >
            {result.passed ? 'Evaluación Aprobada' : 'Evaluación Reprobada'}
          </span>

          <h3 className="text-xl font-semibold text-[#242424] tracking-tight">
            Calificación: {result.scoreObtained.toFixed(1)} / 10
          </h3>

          <p className="text-xs text-[#616161] mt-0.5">
            Nota mínima requerida por el RRA: <strong>{result.passingScore} / 10</strong>
          </p>
        </div>

        {/* Resumen métrico */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6">
          <div className="bg-[#fafafa] p-3 rounded-lg border border-[#e0e0e0] text-center">
            <span className="text-[11px] text-[#616161] block mb-0.5 font-medium">Preguntas Correctas</span>
            <span className="text-lg font-semibold text-[#242424]">
              {result.correctCount} / {result.totalQuestions}
            </span>
          </div>
          <div className="bg-[#fafafa] p-3 rounded-lg border border-[#e0e0e0] text-center">
            <span className="text-[11px] text-[#616161] block mb-0.5 font-medium">Porcentaje</span>
            <span
              className={`text-lg font-semibold ${
                result.passed ? 'text-[#107c10]' : 'text-[#a4262c]'
              }`}
            >
              {Math.round((result.scoreObtained / 10) * 100)}%
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-center gap-3">
          {!result.passed && (
            <button
              type="button"
              onClick={handleReset}
              className="m365-btn m365-btn-secondary text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Intentar Nuevamente
            </button>
          )}

          {result.passed && onProceedToResources && (
            <button
              type="button"
              onClick={onProceedToResources}
              className="m365-btn m365-btn-primary text-xs"
            >
              Descargar Formatos Oficiales <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQ = test.questions[currentQuestionIndex];
  const progressPercent = Math.round(
    (Object.keys(selectedAnswers).length / test.questions.length) * 100,
  );

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
      {/* Barra superior: Título y Temporizador */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-[#edebe9]">
        <div>
          <span className="m365-badge m365-badge--info mb-1 text-[10px]">
            Cuestionario de Conocimiento Normativo
          </span>
          <h3 className="text-sm font-semibold text-[#242424]">{test.title}</h3>
        </div>

        {timeLeft !== null && (
          <div className="flex items-center gap-1.5 text-[#242424] text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-[#0f6cbd]" />
            <span>Tiempo: {formatTimer(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Progreso */}
      <div>
        <div className="flex items-center justify-between text-xs text-[#616161] mb-1 font-medium">
          <span>
            Pregunta {currentQuestionIndex + 1} de {test.questions.length}
          </span>
          <span>
            {Object.keys(selectedAnswers).length} de {test.questions.length} respondidas ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-[#e0e0e0] rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-[#0f6cbd] transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="p-2.5 rounded-md bg-[#fde7e9] border border-[#f1aeb5] text-[#a4262c] text-xs flex items-center gap-2">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Pregunta Actual (Microsoft Forms Style) */}
      {currentQ && (
        <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-4">
          <div className="flex items-start gap-2.5 mb-3.5">
            <span className="h-6 w-6 rounded-full bg-[#0f6cbd] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              {currentQuestionIndex + 1}
            </span>
            <h4 className="text-sm font-medium text-[#242424] leading-snug pt-0.5">
              {currentQ.question}
            </h4>
          </div>

          {/* Opciones */}
          <div className="flex flex-col gap-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              const optionLetter = String.fromCharCode(65 + idx);

              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectOption(currentQ.id, idx)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#ebf3fc] border-[#0f6cbd] text-[#0f6cbd] font-semibold shadow-xs'
                      : 'bg-white border-[#e0e0e0] text-[#242424] hover:bg-[#f5f5f5]'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full border flex items-center justify-center font-semibold text-[11px] ${
                      isSelected
                        ? 'border-[#0f6cbd] bg-[#0f6cbd] text-white'
                        : 'border-[#d1d1d1] text-[#616161]'
                    }`}
                  >
                    {optionLetter}
                  </span>
                  <span className="flex-1">{option}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0f6cbd]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Controles de Navegación */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="m365-btn m365-btn-secondary text-xs"
        >
          Anterior
        </button>

        <div className="flex items-center gap-2">
          {currentQuestionIndex < test.questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="m365-btn m365-btn-primary text-xs"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitTest}
              disabled={isSubmitting}
              className="m365-btn m365-btn-primary text-xs bg-[#107c10] hover:bg-[#0e6b0e] border-[#107c10]"
            >
              {isSubmitting ? 'Calificando...' : 'Finalizar y Entregar Test'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
