import { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Download,
  Lock,
  CheckCircle2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { resourcesApi } from '../api/resources.api';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import type { ResourceFile } from '@/shared/types/resource.types';

interface ResourceCardProps {
  resource: ResourceFile;
  testPassed: boolean;
  canManage: boolean;
  onDeleteSuccess?: (id: string) => void;
}

export function ResourceCard({
  resource,
  testPassed,
  canManage,
  onDeleteSuccess,
}: ResourceCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isLocked = resource.isLockedUntilTestPass && !testPassed && !canManage;

  const handleDownload = async () => {
    if (isLocked) return;
    setErrorMsg(null);
    try {
      setIsDownloading(true);
      await resourcesApi.download(resource.id, `${resource.title}.pdf`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al descargar la plantilla.';
      setErrorMsg(msg);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar la plantilla "${resource.title}"?`)) {
      return;
    }
    try {
      setIsDeleting(true);
      await resourcesApi.delete(resource.id);
      if (onDeleteSuccess) {
        onDeleteSuccess(resource.id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo eliminar el recurso.';
      setErrorMsg(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const getFileBadge = () => {
    const type = (resource.fileType || '').toLowerCase();
    if (type.includes('pdf')) {
      return {
        label: 'PDF Oficial',
        icon: <FileText className="w-5 h-5 text-rose-400" />,
        variant: 'danger' as const,
      };
    }
    if (type.includes('excel') || type.includes('xls')) {
      return {
        label: 'Hoja Excel',
        icon: <FileSpreadsheet className="w-5 h-5 text-emerald-400" />,
        variant: 'success' as const,
      };
    }
    if (type.includes('word') || type.includes('doc')) {
      return {
        label: 'Formato Word',
        icon: <FileCode className="w-5 h-5 text-blue-400" />,
        variant: 'info' as const,
      };
    }
    return {
      label: 'Documento',
      icon: <FileText className="w-5 h-5 text-slate-400" />,
      variant: 'neutral' as const,
    };
  };

  const badge = getFileBadge();

  return (
    <Card
      className={`p-5 flex flex-col justify-between transition-all duration-200 ${
        isLocked
          ? 'bg-slate-900/40 border-slate-800/80 opacity-80'
          : 'hover:border-blue-500/50 hover:shadow-xl shadow-lg'
      }`}
    >
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
              {badge.icon}
            </div>
            <div>
              <Badge variant={badge.variant} size="sm">
                {badge.label}
              </Badge>
            </div>
          </div>

          {/* Indicador de Candado / Desbloqueo */}
          {resource.isLockedUntilTestPass ? (
            isLocked ? (
              <Badge variant="warning" title="Bloqueado hasta aprobar el examen">
                <Lock className="w-3.5 h-3.5" /> Protegido
              </Badge>
            ) : (
              <Badge variant="success" title="Desbloqueado tras aprobar el examen">
                <CheckCircle2 className="w-3.5 h-3.5" /> Desbloqueado
              </Badge>
            )
          ) : (
            <Badge variant="neutral">Acceso Libre</Badge>
          )}
        </div>

        {/* Título de la Plantilla */}
        <h4 className="text-sm font-bold text-white leading-snug mb-1 line-clamp-2">
          {resource.title}
        </h4>

        {/* Descripción de Condición */}
        <p className="text-xs text-slate-400 mb-4">
          {isLocked
            ? 'Debes aprobar la evaluación de inducción (Paso 2) para habilitar la descarga de esta plantilla.'
            : 'Formato oficial listo para descarga y llenado de bitácoras institucionales.'}
        </p>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
        <Button
          type="button"
          variant={isLocked ? 'secondary' : 'primary'}
          size="sm"
          onClick={handleDownload}
          disabled={isLocked}
          isLoading={isDownloading}
          className="flex-1 text-xs"
        >
          {isLocked ? (
            <>
              <Lock className="w-3.5 h-3.5 mr-1" /> Requiere Examen Aprobado
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 mr-1" /> Descargar Plantilla
            </>
          )}
        </Button>

        {canManage && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="p-2.5 h-auto text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
            title="Eliminar plantilla"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
