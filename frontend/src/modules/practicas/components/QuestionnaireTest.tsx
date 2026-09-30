import { useState, useEffect } from 'react';
import {
  Clock,
  XCircle,
  ArrowRight,
  RotateCcw,
  Lock,
  Award,
} from 'lucide-react';
import { testsApi } from '../api/tests.api';
import { Button } from '@/shared/components/ui/Button';
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
  const [timeLeft, setTimeLeft] = useState<number | null>(
    test.timeLimitMinutes ? test.timeLimitMinutes * 60 : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Temporizador
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || result !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, result]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (result) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitAnswers = async () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < test.questions.length && timeLeft && timeLeft > 0) {
      setErrorMessage(
        `Has respondido ${answeredCount} de ${test.questions.length} preguntas. Debes responder todas para enviar.`,
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
    setTimeLeft(test.timeLimitMinutes ? test.timeLimitMinutes * 60 : null);
    setResult(null);
    setErrorMessage(null);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!inductionWatched) {
    return (
      <div className="p-8 text-center bg-[#faf9f8] rounded-[4px] border border-[#e5e7eb] max-w-2xl mx-auto">
        <div className="h-10 w-10 rounded-[2px] bg-[#fff4ce] border border-[#7d5a00]/30 text-[#7d5a00] flex items-center justify-center mx-auto mb-3">
          <Lock className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">Evaluación Normativa Bloqueada</h3>
        <p className="text-xs text-[#605e5c] max-w-md mx-auto leading-relaxed">
          Para rendir este examen es obligatorio haber visto el video de inducción al 100%. Completa la visualización previa en el reproductor.
        </p>
      </div>
    );
  }

  // Pantalla de Resultados Fluent
  if (result) {
    return (
      <div className="p-6 max-w-2xl mx-auto bg-white border border-[#e5e7eb] rounded-[4px] shadow-xs">
        <div className="text-center mb-5">
          <div
            className={`h-12 w-12 rounded-[2px] flex items-center justify-center mx-auto mb-3 border ${
              result.passed
                ? 'bg-[#dff6dd] border-[#107c10]/40 text-[#107c10]'
                : 'bg-[#fde7e9] border-[#a4262c]/40 text-[#a4262c]'
            }`}
          >
            {result.passed ? <Award className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>

          <span
            className={`fluent-badge ${
              result.passed ? 'fluent-badge--success' : 'fluent-badge--error'
            } text-xs mb-2`}
          >
            {result.passed ? 'Evaluación Aprobada' : 'Evaluación Reprobada'}
          </span>

          <h3 className="text-xl font-bold text-[#1a1a1a] tracking-tight">
            Nota Obtenida: {result.scoreObtained.toFixed(1)} / 10
          </h3>

          <p className="text-xs text-[#605e5c] mt-0.5">
            Umbral mínimo de aprobación reglamentario: <strong>{result.passingScore} / 10</strong>
          </p>
        </div>

        {/* Resumen métrico */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6">
          <div className="bg-[#faf9f8] p-3 rounded-[2px] border border-[#e5e7eb] text-center">
            <span className="text-[10px] text-[#605e5c] block mb-0.5 uppercase font-mono">Aciertos</span>
            <span className="text-lg font-bold text-[#1a1a1a]">
              {result.correctCount} / {result.totalQuestions}
            </span>
          </div>
          <div className="bg-[#faf9f8] p-3 rounded-[2px] border border-[#e5e7eb] text-center">
            <span className="text-[10px] text-[#605e5c] block mb-0.5 uppercase font-mono">Efectividad</span>
            <span
              className={`text-lg font-bold ${
                result.passed ? 'text-[#107c10]' : 'text-[#a4262c]'
              }`}
            >
              {Math.round((result.correctCount / result.totalQuestions) * 100)}%
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-center gap-3 pt-3 border-t border-[#e5e7eb]">
          {!result.passed && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-xs py-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reintentar Evaluación
            </Button>
          )}

          {result.passed && onProceedToResources && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onProceedToResources}
              className="gap-1.5 text-xs py-1.5"
            >
              Descargar Plantillas Oficiales <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
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
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-[#e5e7eb]">
        <div>
          <span className="fluent-badge fluent-badge--info mb-0.5 text-[10px]">
            PASO 02 // EVALUACIÓN DE CONOCIMIENTOS
          </span>
          <h3 className="text-sm font-bold text-[#1a1a1a]">{test.title}</h3>
        </div>

        {timeLeft !== null && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#faf9f8] border border-[#d1d5db] text-[#1a1a1a] font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-[#0078d4]" />
            <span>Tiempo: {formatTimer(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Progreso */}
      <div>
        <div className="flex items-center justify-between text-xs text-[#605e5c] mb-1 font-mono">
          <span>
            Pregunta {currentQuestionIndex + 1} de {test.questions.length}
          </span>
          <span>
            {Object.keys(selectedAnswers).length} de {test.questions.length} respondidas ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-[#e5e7eb] rounded-[2px] h-1.5 overflow-hidden">
          <div
            className="h-full bg-[#1b2a4a] transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="p-2.5 rounded-[2px] bg-[#fde7e9] border border-[#a4262c]/30 text-[#a4262c] text-xs flex items-center gap-2">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Pregunta Actual */}
      {currentQ && (
        <div className="bg-[#faf9f8] border border-[#e5e7eb] rounded-[4px] p-4">
          <div className="flex items-start gap-2.5 mb-3">
            <span className="h-6 w-6 rounded-[2px] bg-[#1b2a4a] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              {currentQuestionIndex + 1}
            </span>
            <h4 className="text-xs sm:text-sm font-semibold text-[#1a1a1a] leading-snug">
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
                  className={`w-full text-left p-3 rounded-[2px] border text-xs transition-colors flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#e6f2fb] border-[#0078d4] text-[#1b2a4a] font-semibold'
                      : 'bg-white border-[#d1d5db] text-[#323130] hover:bg-[#faf9f8]'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-[2px] flex items-center justify-center font-bold text-[11px] ${
                      isSelected
                        ? 'bg-[#0078d4] text-white'
                        : 'bg-[#e5e7eb] text-[#605e5c]'
                    }`}
                  >
                    {optionLetter}
                  </span>
                  <span className="flex-1">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navegación y Envío */}
      <div className="flex items-center justify-between pt-2 border-t border-[#e5e7eb]">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="text-xs py-1"
          >
            Anterior
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(test.questions.length - 1, prev + 1))}
            disabled={currentQuestionIndex === test.questions.length - 1}
            className="text-xs py-1"
          >
            Siguiente
          </Button>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleSubmitAnswers}
          isLoading={isSubmitting}
          className="text-xs py-1 px-4"
        >
          Finalizar y Calificar
        </Button>
      </div>
    </div>
  );
}
