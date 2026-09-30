import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, HelpCircle, AlertCircle } from 'lucide-react';
import { testsApi } from '@/modules/practicas/api/tests.api';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
} from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <ModalHeader onClose={onClose}>
        <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <ModalTitle>Configurar Examen Dinámico</ModalTitle>
          <p className="text-xs text-slate-400 font-normal">Espacio: {workspaceTitle}</p>
        </div>
      </ModalHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ModalContent className="max-h-[65vh] overflow-y-auto pr-1">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Título del Cuestionario"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Ej. Evaluación de Normativa y Prácticas"
              />
            </div>

            <div>
              <Input
                label="Nota Mínima (Sobre 10)"
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div>
            <Input
              label="Tiempo Límite en Minutos (0 = Sin límite)"
              type="number"
              min="0"
              max="180"
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
              className="max-w-xs"
            />
          </div>

          {/* Preguntas */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                Preguntas ({questions.length})
              </h4>
              <Button
                type="button"
                variant="purple"
                size="sm"
                onClick={handleAddQuestion}
                className="gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Pregunta
              </Button>
            </div>

            {questions.map((q, qIdx) => (
              <div
                key={q.id}
                className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="h-6 w-6 rounded-md bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {qIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                      placeholder="Redacta el enunciado de la pregunta..."
                      className="ui-input py-1.5 text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Eliminar pregunta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 pt-1">
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
                            className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
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
        </ModalContent>

        <ModalFooter>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="purple" size="sm" isLoading={isSubmitting}>
            Publicar Examen
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
