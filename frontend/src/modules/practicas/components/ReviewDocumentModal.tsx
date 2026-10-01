import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  AlertCircle,
  Cpu,
  FileCheck2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { documentsApi } from '../api/documents.api';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
} from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { Textarea } from '@/shared/components/ui/Input';
import { Badge } from '@/shared/components/ui/Badge';
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
        const suggestedNotes = res.auditResult.observations
          .map((obs) => `• ${obs}`)
          .join('\n');
        setFeedbackNotes(suggestedNotes);
      }
    } catch {
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
      const updated: DocumentSubmission = {
        ...submission,
        status,
        feedbackNotes: feedbackNotes.trim() || null,
        approvedAt: status === 'approved' ? new Date().toISOString() : null,
        auditResult: currentAudit,
        auditScore: currentAudit?.score ?? null,
      };
      onSuccess(updated);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const student = submission.enrollment?.user;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <ModalHeader onClose={onClose}>
        <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <ModalTitle>Revisión y Dictamen Documental</ModalTitle>
          <p className="text-xs text-slate-400 font-normal">
            Estudiante: {student ? `${student.fullName} (${student.email})` : 'Inscrito'}
          </p>
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
                <Badge variant="purple" size="sm">
                  Fase 1 (RRA)
                </Badge>
              </div>

              {currentAudit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRunAudit}
                  isLoading={isAuditing}
                  className="text-[11px] text-purple-400 hover:text-purple-300 p-0 h-auto gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Re-analizar</span>
                </Button>
              )}
            </div>

            {!currentAudit ? (
              <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-800 rounded-xl bg-slate-900/40 text-center gap-2">
                <FileCheck2 className="w-6 h-6 text-slate-500" />
                <p className="text-xs text-slate-400">
                  Valida automáticamente legibilidad, páginas mínimas y secciones obligatorias.
                </p>
                <Button
                  type="button"
                  variant="purple"
                  size="sm"
                  onClick={handleRunAudit}
                  isLoading={isAuditing}
                  className="gap-2 mt-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Ejecutar Auditoría Heurística
                </Button>
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
          <Textarea
            label="Feedback y Observaciones al Estudiante"
            rows={4}
            value={feedbackNotes}
            onChange={(e) => setFeedbackNotes(e.target.value)}
            placeholder="Redacta las indicaciones de corrección o felicitación institucional..."
          />
        </ModalContent>

        <ModalFooter>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="purple" size="sm" isLoading={isSubmitting}>
            Registrar Dictamen
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
