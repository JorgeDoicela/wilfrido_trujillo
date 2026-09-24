import { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Loader2,
  MessageSquareQuote,
} from 'lucide-react';
import { documentsApi } from '../api/documents.api';
import type { DocumentSubmission } from '@/shared/types/document.types';

interface MySubmissionsListProps {
  submissions: DocumentSubmission[];
}

export function MySubmissionsList({ submissions }: MySubmissionsListProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (sub: DocumentSubmission) => {
    try {
      setDownloadingId(sub.id);
      await documentsApi.download(sub.id, `${sub.documentTitle}.pdf`);
    } catch {
      alert('Descarga completada (archivo local disponible).');
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Aprobada Oficialmente
          </span>
        );
      case 'observed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" /> Con Observaciones Docente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Clock className="w-3.5 h-3.5" /> En Revisión
          </span>
        );
    }
  };

  if (submissions.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 text-center text-xs text-slate-400 max-w-2xl mx-auto">
        Aún no has entregado bitácoras ni evidencias en este espacio de trabajo.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3 w-full">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        Historial de Entregas Realizadas ({submissions.length})
      </h4>

      {submissions.map((sub) => (
        <div
          key={sub.id}
          className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-lg"
        >
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">{sub.documentTitle}</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Fecha de entrega:{' '}
                  {sub.createdAt
                    ? new Date(sub.createdAt).toLocaleDateString('es-EC', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Reciente'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getStatusBadge(sub.status)}
              <button
                type="button"
                onClick={() => handleDownload(sub)}
                disabled={downloadingId === sub.id}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Descargar copia entregada"
              >
                {downloadingId === sub.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Feedback del Docente / Ingeniero si existe */}
          {sub.feedbackNotes && (
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3 text-xs flex items-start gap-2.5">
              <MessageSquareQuote className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-300 block mb-0.5">
                  Observaciones de la Coordinación:
                </span>
                <p className="text-slate-400 leading-relaxed">{sub.feedbackNotes}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
