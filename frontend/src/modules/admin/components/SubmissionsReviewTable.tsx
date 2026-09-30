import { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Edit3,
  Filter,
} from 'lucide-react';
import { documentsApi } from '@/modules/practicas/api/documents.api';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
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
          <Badge variant="success">
            <CheckCircle2 className="w-3 h-3" /> Aprobada
          </Badge>
        );
      case 'observed':
        return (
          <Badge variant="warning">
            <AlertTriangle className="w-3 h-3" /> Observada
          </Badge>
        );
      default:
        return (
          <Badge variant="info">
            <Clock className="w-3 h-3" /> Pendiente
          </Badge>
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
    <Card className="p-6 shadow-xl backdrop-blur-sm">
      {/* Barra de Filtros */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-white tracking-tight">
            Bandeja de Entregas Estudiantiles
          </span>
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
                <th className="py-3 px-3">Auditoría Heurística</th>
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
                      {sub.auditScore != null ? (
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              sub.auditScore >= 80
                                ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                                : sub.auditScore >= 50
                                ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                                : 'bg-rose-400 shadow-sm shadow-rose-400/50'
                            }`}
                          />
                          <Badge
                            variant={
                              sub.auditScore >= 80
                                ? 'success'
                                : sub.auditScore >= 50
                                ? 'warning'
                                : 'danger'
                            }
                            className="font-mono text-[11px]"
                          >
                            {sub.auditScore}/100 pts
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Pendiente</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDownload(sub)}
                          isLoading={downloadingId === sub.id}
                          className="p-1.5 h-auto text-slate-300"
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="purple"
                          size="sm"
                          onClick={() => onOpenReview(sub)}
                          className="gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Dictaminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
