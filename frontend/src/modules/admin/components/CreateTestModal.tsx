import { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, HelpCircle, AlertCircle, Loader2 } from 'lucide-react';
import { testsApi } from '@/modules/practicas/api/tests.api';
import type { Test } from '@/shared/types/test.types';

interface QuestionDraft {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

interface CreateTestModalProps {
  isOpen: boolean;
  workspaceId: string;
  workspaceTitle: string;
  onClose: () => void;
  onSuccess: (createdTest: Test) => void;
}

export function CreateTestModal({
  isOpen,
  workspaceId,
  workspaceTitle,
  onClose,
  onSuccess,
}: CreateTestModalProps) {
  const [title, setTitle] = useState('Evaluación Diagnóstica y de Inducción');
  const [passingScore, setPassingScore] = useState(7);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      id: 'q1',
      question: '¿Cuál es el porcentaje mínimo obligatorio de visualización del video de inducción?',
      options: ['50%', '75%', '100%', '80%'],
      correctOptionIndex: 2,
    },
    {
      id: 'q2',
      question: '¿En qué formato deben entregarse las bitácoras finales aprobadas por el tutor empresarial?',
      options: ['Documento Word editable (.docx)', 'Formato digital PDF con firmas correspondientes', 'Imagen capturada (.jpg)', 'Texto plano (.txt)'],
      correctOptionIndex: 1,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    const newId = `q${Date.now()}`;
    setQuestions((prev) => [
      ...prev,
      {
        id: newId,
        question: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      setErrorMessage('La evaluación debe tener al menos una pregunta.');
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, text: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], question: text };
      return updated;
    });
  };

  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const newOptions = [...updated[qIndex].options];
      newOptions[optIndex] = text;
      updated[qIndex] = { ...updated[qIndex], options: newOptions };
      return updated;
    });
  };

  const handleCorrectOptionChange = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = { ...updated[qIndex], correctOptionIndex: optIndex };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Ingresa el título de la evaluación.');
      return;
    }

    if (questions.length === 0) {
      setErrorMessage('Debes incluir al menos una pregunta.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setErrorMessage(`La pregunta #${i + 1} no tiene enunciado.`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        setErrorMessage(`Todas las opciones de la pregunta #${i + 1} deben estar completadas.`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const created = await testsApi.create({
        workspaceId,
        title: title.trim(),
        passingScore: Number(passingScore),
        timeLimitMinutes: Number(timeLimitMinutes),
        questions,
      });

      onSuccess(created);
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Error al registrar el cuestionario en el servidor.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Configurar Examen Dinámico</h3>
              <p className="text-xs text-slate-400">Espacio: {workspaceTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Título del Cuestionario
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Ej. Evaluación de Normativa y Prácticas"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nota Mínima (Sobre 10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Tiempo Límite en Minutos (Opcional, 0 = Sin límite)
            </label>
            <input
              type="number"
              min="0"
              max="180"
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
              className="w-full max-w-xs px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Preguntas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h4 className="text-sm font-semibold text-white">Preguntas ({questions.length})</h4>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Pregunta
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div
                key={q.id}
                className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="h-6 w-6 rounded-md bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center">
                      {qIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                      placeholder="Redacta la pregunta..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                    title="Eliminar pregunta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-[11px] text-slate-400">
                    Opciones (marca el círculo de la respuesta correcta):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = q.correctOptionIndex === optIdx;
                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                            isCorrect
                              ? 'bg-purple-500/10 border-purple-500/40 text-purple-200'
                              : 'bg-slate-900/50 border-slate-800 text-slate-300'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleCorrectOptionChange(qIdx, optIdx)}
                            className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                              isCorrect
                                ? 'bg-purple-600 border-purple-500 text-white'
                                : 'border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            {isCorrect && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                            placeholder={`Opción ${String.fromCharCode(65 + optIdx)}`}
                            className="bg-transparent text-xs w-full text-white focus:outline-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer del Formulario */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
                </>
              ) : (
                'Publicar Examen'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
