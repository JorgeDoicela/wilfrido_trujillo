import { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
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
      alert('Descarga completada.');
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="m365-badge m365-badge--success">
            <CheckCircle2 className="w-3 h-3" /> Aprobada
          </span>
        );
      case 'observed':
        return (
          <span className="m365-badge m365-badge--warning">
            <AlertTriangle className="w-3 h-3" /> Con Observaciones
          </span>
        );
      default:
        return (
          <span className="m365-badge m365-badge--info">
            En Revisión
          </span>
        );
    }
  };

  if (submissions.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-[#616161] max-w-2xl mx-auto bg-[#fafafa] rounded-lg border border-[#e0e0e0]">
        Aún no has consignado bitácoras ni evidencias en este espacio de trabajo.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-2.5">
      <div className="flex items-center justify-between pb-1.5 border-b border-[#edebe9]">
        <h4 className="text-xs font-semibold text-[#242424]">
          Mis Evidencias Consignadas ({submissions.length})
        </h4>
        <span className="text-[11px] text-[#616161]">Estado en tiempo real</span>
      </div>

      <div className="overflow-x-auto border border-[#e0e0e0] rounded-lg shadow-2xs bg-white">
        <table className="m365-table">
          <thead>
            <tr>
              <th>DOCUMENTO</th>
              <th>FECHA DE CARGA</th>
              <th>ESTADO</th>
              <th className="text-right">ARCHIVO</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id}>
                <td>
                  <div className="flex items-center gap-1.5 font-medium text-[#242424]">
                    <FileText className="w-3.5 h-3.5 text-[#0f6cbd] flex-shrink-0" />
                    <span>{sub.documentTitle}</span>
                  </div>
                  {sub.feedbackNotes && (
                    <div className="text-[11px] text-[#7d5a00] italic mt-0.5">
                      Retroalimentación: {sub.feedbackNotes}
                    </div>
                  )}
                </td>
                <td className="text-[11px] text-[#616161] font-mono whitespace-nowrap">
                  {sub.createdAt
                    ? new Date(sub.createdAt).toLocaleDateString('es-EC', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Reciente'}
                </td>
                <td>{getStatusBadge(sub.status)}</td>
                <td className="text-right">
                  <button
                    type="button"
                    onClick={() => handleDownload(sub)}
                    disabled={downloadingId === sub.id}
                    title="Descargar documento oficial"
                    className="h-7 w-7 rounded-md border border-[#d1d1d1] bg-white text-[#424242] hover:bg-[#f5f5f5] inline-flex items-center justify-center transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
