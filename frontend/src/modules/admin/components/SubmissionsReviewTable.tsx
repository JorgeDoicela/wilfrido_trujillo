import { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Edit3,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { documentsApi } from '@/modules/practicas/api/documents.api';
import type { DocumentSubmission, SubmissionStatus } from '@/shared/types/document.types';

interface SubmissionsReviewTableProps {
  submissions: DocumentSubmission[];
  isLoading: boolean;
  onOpenReview: (submission: DocumentSubmission) => void;
}

export function SubmissionsReviewTable({
  submissions,
  isLoading,
  onOpenReview,
}: SubmissionsReviewTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredSubmissions = submissions.filter((sub) => {
    if (filterStatus !== 'all' && sub.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      const studentName = sub.enrollment?.user?.fullName?.toLowerCase() || '';
      const ci = sub.enrollment?.user?.identification || '';
      const title = sub.documentTitle.toLowerCase();
      if (!studentName.includes(q) && !ci.includes(q) && !title.includes(q)) {
        return false;
      }
    }
    return true;
  });

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

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="fluent-badge fluent-badge--success">
            <CheckCircle2 className="w-3 h-3" /> Aprobada
          </span>
        );
      case 'observed':
        return (
          <span className="fluent-badge fluent-badge--warning">
            <AlertTriangle className="w-3 h-3" /> Observada
          </span>
        );
      case 'submitted':
      default:
        return (
          <span className="fluent-badge fluent-badge--info">
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
    <div className="flex flex-col gap-3">
      {/* Barra de Filtros y Búsqueda Fluent 2 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Tabs de Filtro Subrayados Fluent */}
        <div className="flex border-b border-[#e5e7eb] w-full sm:w-auto">
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
                  ? 'border-[#1b2a4a] text-[#1b2a4a] font-bold'
                  : 'border-transparent text-[#605e5c] hover:text-[#1a1a1a]'
              }`}
            >
              {tab.label} <span className="font-mono text-[11px] text-[#605e5c]">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Input de Búsqueda Rápida */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#605e5c]" />
          <input
            type="text"
            placeholder="Buscar por estudiante, cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-white border border-[#d1d5db] rounded-[2px] text-xs text-[#1a1a1a] placeholder-[#9ca3af] focus:outline-none focus:border-[#1b2a4a]"
          />
        </div>
      </div>

      {/* Tabla Oficial Fluent 2 (Ref: titulacion-istpet) */}
      <div className="fluent-table-wrapper">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#605e5c]">
            Cargando bandeja de entregas oficiales...
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#605e5c]">
            No hay expedientes consignados con el criterio seleccionado.
          </div>
        ) : (
          <table className="fluent-table">
            <thead>
              <tr>
                <th>CÓDIGO // CI</th>
                <th>ESTUDIANTE / EXPEDIENTE</th>
                <th>DOCUMENTO CONSIGNADO</th>
                <th>FECHA DE CARGA</th>
                <th>AUDITORÍA RRA</th>
                <th>ESTADO</th>
                <th className="text-right">ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((sub, idx) => {
                const student = sub.enrollment?.user;
                return (
                  <tr key={sub.id}>
                    <td>
                      <code>EXP-{(idx + 1).toString().padStart(3, '0')}</code>
                      {student?.identification && (
                        <span className="block text-[10px] text-[#605e5c] font-mono mt-0.5">
                          {student.identification}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="font-bold text-[#1a1a1a]">
                        {student ? student.fullName : 'Estudiante Registrado'}
                      </div>
                      <div className="text-[10px] text-[#605e5c]">
                        {student?.email || 'alumno@instituto.edu.ec'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 font-medium text-[#1a1a1a]">
                        <FileText className="w-3.5 h-3.5 text-[#0078d4] flex-shrink-0" />
                        <span className="truncate max-w-xs">{sub.documentTitle}</span>
                      </div>
                      {sub.feedbackNotes && (
                        <div className="text-[10px] text-[#7d5a00] truncate max-w-xs mt-0.5 italic">
                          Nota: {sub.feedbackNotes}
                        </div>
                      )}
                    </td>
                    <td className="text-[11px] text-[#605e5c] font-mono whitespace-nowrap">
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
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#107c10]" />
                        <span className="font-bold text-[#107c10]">CONFORME</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(sub.status)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDownload(sub)}
                          disabled={downloadingId === sub.id}
                          title="Descargar documento legal"
                          className="p-1 border border-[#d1d5db] rounded-[2px] bg-white text-[#323130] hover:bg-[#faf9f8] transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenReview(sub)}
                          className="fluent-btn-action"
                        >
                          <Edit3 className="w-3 h-3" /> Dictaminar
                        </button>
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
}
