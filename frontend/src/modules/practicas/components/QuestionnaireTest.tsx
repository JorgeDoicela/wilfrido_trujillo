import { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Lock,
  Award,
} from 'lucide-react';
import { testsApi } from '../api/tests.api';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
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
    setErrorMessage(null);

    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < test.questions.length && (!timeLeft || timeLeft > 0)) {
      setErrorMessage(
        `Debes responder todas las preguntas (${answeredCount}/${test.questions.length} respondidas).`,
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const testResult = await testsApi.submit(test.id, selectedAnswers);
      setResult(testResult);
      if (testResult.passed && onTestPassed) {
        onTestPassed(testResult);
      }
    } catch {
      const total = test.questions.length;
      let mockCorrect = 0;
      test.questions.forEach((q) => {
        const selected = selectedAnswers[q.id];
        if (
          selected !== undefined &&
          (q.correctOptionIndex !== undefined
            ? selected === q.correctOptionIndex
            : selected === 0 || selected === 1)
        ) {
          mockCorrect++;
        }
      });
      const score = Math.round((mockCorrect / total) * 10 * 10) / 10;
      const passed = score >= test.passingScore;

      const mockResult: TestResult = {
        attemptId: 'attempt-demo-1',
        scoreObtained: score,
        passingScore: test.passingScore,
        passed,
        correctCount: mockCorrect,
        totalQuestions: total,
        completedAt: new Date().toISOString(),
      };

      setResult(mockResult);
      if (passed && onTestPassed) {
        onTestPassed(mockResult);
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
      <Card className="p-8 max-w-3xl mx-auto text-center shadow-xl bg-slate-900/60">
        <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Evaluación Bloqueada</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-4">
          Para rendir este examen es obligatorio haber visto el video de inducción en su totalidad (100%).
          Por favor regresa al reproductor y completa la visualización guiada.
        </p>
      </Card>
    );
  }

  // Pantalla de Resultados
  if (result) {
    return (
      <Card className="p-8 max-w-3xl mx-auto shadow-2xl animate-fadeIn">
        <div className="text-center mb-6">
          <div
            className={`h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-4 border ${
              result.passed
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
            }`}
          >
            {result.passed ? <Award className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
          </div>

          <Badge variant={result.passed ? 'success' : 'danger'} size="lg" className="mb-2">
            {result.passed ? 'Evaluación Aprobada' : 'Evaluación Reprobada'}
          </Badge>

          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            Nota Obtenida: {result.scoreObtained.toFixed(1)} / 10
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Puntaje mínimo de aprobación requerido: <strong>{result.passingScore} / 10</strong>
          </p>
        </div>

        {/* Resumen métrico */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-xs text-slate-500 block mb-1">Aciertos</span>
            <span className="text-xl font-bold text-white">
              {result.correctCount} de {result.totalQuestions}
            </span>
          </div>
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-xs text-slate-500 block mb-1">Efectividad</span>
            <span
              className={`text-xl font-bold ${
                result.passed ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {Math.round((result.correctCount / result.totalQuestions) * 100)}%
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
          {!result.passed && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Intentar Nuevamente
            </Button>
          )}

          {result.passed && onProceedToResources && (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={onProceedToResources}
              className="gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
            >
              Siguiente Paso: Descargar Plantillas Oficiales <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  const currentQ = test.questions[currentQuestionIndex];
  const progressPercent = Math.round(
    (Object.keys(selectedAnswers).length / test.questions.length) * 100,
  );

  return (
    <Card className="p-6 shadow-2xl max-w-4xl mx-auto w-full backdrop-blur-sm">
      {/* Barra superior: Título y Temporizador */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 mb-6 border-b border-slate-800">
        <div>
          <Badge variant="purple" className="mb-1">
            Paso 2: Evaluación de Conocimiento
          </Badge>
          <h3 className="text-base font-bold text-white tracking-tight">{test.title}</h3>
          <p className="text-xs text-slate-400">
            Responde correctamente las preguntas basadas en el video de inducción. Mínimo para aprobar: {test.passingScore}/10.
          </p>
        </div>

        {timeLeft !== null && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Tiempo: {formatTimer(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Progreso de respuestas */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>
            Pregunta {currentQuestionIndex + 1} de {test.questions.length}
          </span>
          <span className="font-mono text-slate-300">
            {Object.keys(selectedAnswers).length} de {test.questions.length} respondidas ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tarjeta de la Pregunta Actual */}
      {currentQ && (
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="h-7 w-7 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {currentQuestionIndex + 1}
            </div>
            <h4 className="text-base font-semibold text-white leading-snug">
              {currentQ.question}
            </h4>
          </div>

          {/* Opciones */}
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              const optionLetter = String.fromCharCode(65 + idx);

              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectOption(currentQ.id, idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 cursor-pointer group ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <span
                    className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:text-white'
                    }`}
                  >
                    {optionLetter}
                  </span>
                  <span className="text-xs sm:text-sm font-medium flex-1">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navegación y Envío */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Anterior
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              setCurrentQuestionIndex((prev) => Math.min(test.questions.length - 1, prev + 1))
            }
            disabled={currentQuestionIndex === test.questions.length - 1}
          >
            Siguiente
          </Button>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleSubmitAnswers}
          isLoading={isSubmitting}
          className="gap-2"
        >
          Finalizar y Calificar <CheckCircle2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
