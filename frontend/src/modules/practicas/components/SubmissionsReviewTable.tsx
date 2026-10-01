import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { documentsApi } from '../api/documents.api';
import type { DocumentSubmission, SubmissionStatus } from '@/shared/types/document.types';

export interface SubmissionsReviewTableProps {
  submissions: DocumentSubmission[];
  isLoading: boolean;
  onOpenReview?: (submission: DocumentSubmission) => void;
}

export const SubmissionsReviewTable: React.FC<SubmissionsReviewTableProps> = ({
  submissions,
  isLoading,
  onOpenReview,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
    const student = sub.enrollment?.user;
    const matchesSearch =
      sub.documentTitle.toLowerCase().includes(search.toLowerCase()) ||
      (student?.fullName && student.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (student?.identification && student.identification.includes(search));
    return matchesFilter && matchesSearch;
  });

  const handleDownload = async (sub: DocumentSubmission) => {
    try {
      setDownloadingId(sub.id);
      await documentsApi.download(sub.id, `${sub.documentTitle}.pdf`);
    } catch {
      window.open(sub.fileUrl, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
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
            <AlertTriangle className="w-3 h-3" /> Observada
          </span>
        );
      case 'submitted':
      default:
        return (
          <span className="m365-badge m365-badge--info">
            En Revisión
          </span>
        );
    }
  };

  const counts = {
    all: submissions.length,
    submitted: submissions.filter((s) => s.status === 'submitted').length,
    observed: submissions.filter((s) => s.status === 'observed').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Barra de Filtros y Búsqueda M365 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Tabs de Filtro Subrayados M365 */}
        <div className="flex border-b border-[#edebe9] w-full sm:w-auto">
          {[
            { id: 'all', label: 'Todas las Entregas', count: counts.all },
            { id: 'submitted', label: 'Pendientes', count: counts.submitted },
            { id: 'observed', label: 'Observadas', count: counts.observed },
            { id: 'approved', label: 'Aprobadas', count: counts.approved },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-2 text-xs font-medium border-b-2 -mb-[1px] transition-colors cursor-pointer ${
                filterStatus === tab.id
                  ? 'border-[#0f6cbd] text-[#0f6cbd] font-semibold'
                  : 'border-transparent text-[#616161] hover:text-[#242424]'
              }`}
            >
              {tab.label} <span className="text-[11px] text-[#8a8886]">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Input de Búsqueda Rápida */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#616161]" />
          <input
            type="text"
            placeholder="Buscar estudiante, cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="m365-input pl-8 text-xs h-7.5"
          />
        </div>
      </div>

      {/* Tabla Oficial M365 SharePoint / Lists */}
      <div className="overflow-x-auto border border-[#e0e0e0] rounded-lg shadow-2xs bg-white">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#616161]">
            Cargando bandeja de entregas oficiales...
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#616161]">
            No hay expedientes consignados con el criterio seleccionado.
          </div>
        ) : (
          <table className="m365-table">
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>ESTUDIANTE / EXPEDIENTE</th>
                <th>DOCUMENTO CONSIGNADO</th>
                <th>FECHA DE CARGA</th>
                <th>DICTAMEN RRA</th>
                <th>ESTADO</th>
                <th className="text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((sub, idx) => {
                const student = sub.enrollment?.user;
                return (
                  <tr key={sub.id}>
                    <td>
                      <code className="text-xs font-mono bg-[#f0f0f0] px-1.5 py-0.5 rounded-sm text-[#424242]">
                        EXP-{(idx + 1).toString().padStart(3, '0')}
                      </code>
                      {student?.identification && (
                        <span className="block text-[10px] text-[#616161] font-mono mt-0.5">
                          {student.identification}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="font-semibold text-[#242424]">
                        {student ? student.fullName : 'Estudiante Registrado'}
                      </div>
                      <div className="text-[11px] text-[#616161]">
                        {student?.email || 'alumno@instituto.edu.ec'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 font-medium text-[#242424]">
                        <FileText className="w-3.5 h-3.5 text-[#0f6cbd] flex-shrink-0" />
                        <span className="truncate max-w-xs">{sub.documentTitle}</span>
                      </div>
                      {sub.feedbackNotes && (
                        <div className="text-[11px] text-[#7d5a00] truncate max-w-xs mt-0.5 italic">
                          Nota: {sub.feedbackNotes}
                        </div>
                      )}
                    </td>
                    <td className="text-[11px] text-[#616161] font-mono whitespace-nowrap">
                      {sub.createdAt
                        ? new Date(sub.createdAt).toLocaleDateString('es-EC', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Reciente'}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#107c10]" />
                        <span className="font-semibold text-[#107c10]">CONFORME</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(sub.status)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDownload(sub)}
                          disabled={downloadingId === sub.id}
                          title="Descargar documento oficial"
                          className="h-7 w-7 rounded-md border border-[#d1d1d1] bg-white text-[#424242] hover:bg-[#f5f5f5] flex items-center justify-center transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        {onOpenReview && (
                          <button
                            type="button"
                            onClick={() => onOpenReview(sub)}
                            className="m365-btn m365-btn-primary text-xs h-7 px-2.5"
                          >
                            <Edit3 className="w-3 h-3" /> Dictaminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
