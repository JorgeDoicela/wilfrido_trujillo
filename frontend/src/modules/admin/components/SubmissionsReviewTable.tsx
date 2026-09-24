import { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Edit3,
  Loader2,
  Filter,
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
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredSubmissions = submissions.filter((sub) => {
    if (filterStatus === 'all') return true;
    return sub.status === filterStatus;
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Aprobada
          </span>
        );
      case 'observed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" /> Observada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Clock className="w-3.5 h-3.5" /> Pendiente
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
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
      {/* Barra de Filtros */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-white">Bandeja de Entregas Estudiantiles</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'all', label: 'Todas', count: counts.all },
            { id: 'submitted', label: 'Pendientes', count: counts.submitted },
            { id: 'observed', label: 'Observadas', count: counts.observed },
            { id: 'approved', label: 'Aprobadas', count: counts.approved },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Cargando bandeja de entregas...</div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400">
          No hay entregas para mostrar con el filtro seleccionado.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Estudiante</th>
                <th className="py-3 px-3">Documento Entregado</th>
                <th className="py-3 px-3">Fecha de Carga</th>
                <th className="py-3 px-3">Estado Actual</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSubmissions.map((sub) => {
                const student = sub.enrollment?.user;
                return (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">
                        {student ? student.fullName : 'Estudiante Inscrito'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {student?.identification && `CI: ${student.identification}`}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span className="truncate max-w-xs">{sub.documentTitle}</span>
                      </div>
                      {sub.feedbackNotes && (
                        <div className="text-[10px] text-amber-300/90 truncate max-w-xs mt-0.5">
                          Nota: {sub.feedbackNotes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                      {sub.createdAt
                        ? new Date(sub.createdAt).toLocaleDateString('es-EC', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Reciente'}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownload(sub)}
                          disabled={downloadingId === sub.id}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                          title="Descargar PDF"
                        >
                          {downloadingId === sub.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenReview(sub)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-purple-600/20 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Dictaminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
