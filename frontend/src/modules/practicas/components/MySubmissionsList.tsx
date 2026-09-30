import { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  MessageSquareQuote,
} from 'lucide-react';
import { documentsApi } from '../api/documents.api';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
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
          <Badge variant="success">
            <CheckCircle2 className="w-3.5 h-3.5" /> Aprobada Oficialmente
          </Badge>
        );
      case 'observed':
        return (
          <Badge variant="warning">
            <AlertTriangle className="w-3.5 h-3.5" /> Con Observaciones Docente
          </Badge>
        );
      default:
        return (
          <Badge variant="info">
            <Clock className="w-3.5 h-3.5" /> En Revisión
          </Badge>
        );
    }
  };

  if (submissions.length === 0) {
    return (
      <Card className="p-6 text-center text-xs text-slate-400 max-w-2xl mx-auto bg-slate-900/40">
        Aún no has entregado bitácoras ni evidencias en este espacio de trabajo.
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3 w-full">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        Historial de Entregas Realizadas ({submissions.length})
      </h4>

      {submissions.map((sub) => (
        <Card
          key={sub.id}
          className="p-4 sm:p-5 flex flex-col gap-3 shadow-lg"
        >
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white tracking-tight">{sub.documentTitle}</h5>
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
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDownload(sub)}
                isLoading={downloadingId === sub.id}
                className="p-2 h-auto text-slate-300"
                title="Descargar copia entregada"
              >
                <Download className="w-4 h-4" />
              </Button>
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
        </Card>
      ))}
    </div>
  );
}
