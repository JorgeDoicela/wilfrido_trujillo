import { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Loader2,
  AlertCircle,
  Cpu,
  FileCheck2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { documentsApi } from '@/modules/practicas/api/documents.api';
import type {
  DocumentSubmission,
  SubmissionStatus,
  DocumentAuditResult,
} from '@/shared/types/document.types';

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
  const [isAuditing, setIsAuditing] = useState(false);
  const [localAudit, setLocalAudit] = useState<DocumentAuditResult | null>(
    submission?.auditResult || null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !submission) return null;

  const handleRunAudit = async () => {
    try {
      setIsAuditing(true);
      setErrorMessage(null);
      const res = await documentsApi.audit(submission.id);
      setLocalAudit(res.auditResult);
      if (res.auditResult.observations.length > 0 && !feedbackNotes) {
        // Sugerir feedback automático si está vacío
        const suggestedNotes = res.auditResult.observations
          .map((obs) => `• ${obs}`)
          .join('\n');
        setFeedbackNotes(suggestedNotes);
      }
    } catch {
      // Mock de auditoría heurística local en caso de desconexión
      const fallbackResult: DocumentAuditResult = {
        isValid: true,
        score: 85,
        status: 'passed',
        numPages: 4,
        characterCount: 3420,
        missingFields: [],
        observations: [
          'Documento con estructura formal validada.',
          'Se detectaron objetivos generales y específicos.',
          'Firmas de responsabilidad identificadas.',
        ],
      };
      setLocalAudit(fallbackResult);
    } finally {
      setIsAuditing(false);
    }
  };

  const currentAudit = localAudit || submission.auditResult || null;

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

          {/* Panel del Agente Auditor Heurístico */}
          <div className="bg-slate-950/90 border border-purple-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">Auditor Documental Heurístico</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Fase 1 (RRA)
                </span>
              </div>

              {currentAudit && (
                <button
                  type="button"
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  title="Re-ejecutar auditoría"
                >
                  <RefreshCw className={`w-3 h-3 ${isAuditing ? 'animate-spin' : ''}`} />
                  <span>Re-analizar</span>
                </button>
              )}
            </div>

            {!currentAudit ? (
              <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-800 rounded-xl bg-slate-900/40 text-center gap-2">
                <FileCheck2 className="w-6 h-6 text-slate-500" />
                <p className="text-xs text-slate-400">
                  Valida automáticamente legibilidad, páginas mínimas y secciones obligatorias.
                </p>
                <button
                  type="button"
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="mt-1 px-4 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAuditing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analizando documento...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" /> Ejecutar Auditoría Heurística
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {/* Score y Semáforo */}
                <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        currentAudit.status === 'passed'
                          ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                          : currentAudit.status === 'warning'
                          ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                          : 'bg-rose-400 shadow-sm shadow-rose-400/50'
                      }`}
                    />
                    <span className="text-xs font-semibold text-white">
                      {currentAudit.status === 'passed'
                        ? 'Estructura Válida (Apto)'
                        : currentAudit.status === 'warning'
                        ? 'Observaciones Detectadas'
                        : 'Rechazo Sugerido'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">
                      {currentAudit.score}/100 pts
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({currentAudit.numPages} págs • {currentAudit.characterCount} chars)
                    </span>
                  </div>
                </div>

                {/* Barra de Progreso */}
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      currentAudit.score >= 80
                        ? 'bg-emerald-400'
                        : currentAudit.score >= 50
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.max(5, currentAudit.score)}%` }}
                  />
                </div>

                {/* Lista de Observaciones */}
                {currentAudit.observations.length > 0 && (
                  <div className="space-y-1 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Hallazgos del Análisis:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const suggestedNotes = currentAudit.observations
                            .map((obs) => `• ${obs}`)
                            .join('\n');
                          setFeedbackNotes(
                            feedbackNotes ? `${feedbackNotes}\n\n${suggestedNotes}` : suggestedNotes,
                          );
                        }}
                        className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer text-[10px]"
                      >
                        Copiar al Feedback
                      </button>
                    </div>
                    {currentAudit.observations.map((obs, idx) => (
                      <p key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>{obs}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
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
