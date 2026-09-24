import { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { documentsApi } from '@/modules/practicas/api/documents.api';
import type { DocumentSubmission, SubmissionStatus } from '@/shared/types/document.types';

interface ReviewDocumentModalProps {
  submission: DocumentSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: DocumentSubmission) => void;
}

export function ReviewDocumentModal({
  submission,
  isOpen,
  onClose,
  onSuccess,
}: ReviewDocumentModalProps) {
  const [status, setStatus] = useState<SubmissionStatus>('approved');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !submission) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (status === 'observed' && !feedbackNotes.trim()) {
      setErrorMessage('Debes redactar las observaciones para que el alumno pueda corregir su entrega.');
      return;
    }

    try {
      setIsSubmitting(true);
      const updated = await documentsApi.review(submission.id, {
        status,
        feedbackNotes: feedbackNotes.trim() || undefined,
      });
      onSuccess(updated);
      onClose();
    } catch {
      // Fallback demo
      const updated: DocumentSubmission = {
        ...submission,
        status,
        feedbackNotes: feedbackNotes.trim() || null,
        auditedAt: new Date().toISOString(),
        approvedAt: status === 'approved' ? new Date().toISOString() : null,
      };
      onSuccess(updated);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const studentName = submission.enrollment?.user?.fullName || 'Estudiante';
  const studentEmail = submission.enrollment?.user?.email || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Revisión y Dictamen Docente</h3>
              <p className="text-xs text-slate-400">
                {studentName} {studentEmail && `• ${studentEmail}`}
              </p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Resumen del Documento */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
              Documento Entregado
            </span>
            <p className="text-sm font-bold text-white">{submission.documentTitle}</p>
          </div>

          {/* Selector de Dictamen */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Dictamen de la Coordinación
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('approved')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  status === 'approved'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 ${status === 'approved' ? 'text-emerald-400' : 'text-slate-500'}`}
                />
                <span className="text-xs font-bold">Aprobar Entrega</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('observed')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  status === 'observed'
                    ? 'bg-amber-600/20 border-amber-500 text-white shadow-md shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <AlertTriangle
                  className={`w-5 h-5 ${status === 'observed' ? 'text-amber-400' : 'text-slate-500'}`}
                />
                <span className="text-xs font-bold">Emitir Observaciones</span>
              </button>
            </div>
          </div>

          {/* Feedback Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Feedback y Observaciones al Estudiante
            </label>
            <textarea
              rows={4}
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              placeholder="Redacta las indicaciones de corrección o felicitación institucional..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
              className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 shadow-md shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
                </>
              ) : (
                'Registrar Dictamen'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
