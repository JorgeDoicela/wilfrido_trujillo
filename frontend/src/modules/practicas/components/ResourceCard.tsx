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
      const msg = err instanceof Error ? err.message : 'Error al eliminar la plantilla.';
      setErrorMsg(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const getFileBadge = () => {
    const type = resource.fileType.toLowerCase();
    if (type.includes('pdf')) {
      return {
        label: 'PDF Oficial',
        icon: <FileText className="w-4 h-4 text-[#a4262c]" />,
      };
    }
    if (type.includes('word') || type.includes('doc')) {
      return {
        label: 'Documento Word',
        icon: <FileCode className="w-4 h-4 text-[#0f6cbd]" />,
      };
    }
    if (type.includes('excel') || type.includes('sheet') || type.includes('xls')) {
      return {
        label: 'Hoja de Cálculo',
        icon: <FileSpreadsheet className="w-4 h-4 text-[#107c10]" />,
      };
    }
    return {
      label: 'Documento',
      icon: <FileText className="w-4 h-4 text-[#C4C4C4]" />,
    };
  };

  const badge = getFileBadge();

  return (
    <div
      className={`glass-card p-4 flex flex-col justify-between transition-all ${
        isLocked ? 'opacity-70 bg-white/[0.02]' : 'hover:border-white/30'
      }`}
    >
      <div>
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {badge.icon}
            </div>
            <span className="text-[11px] font-semibold text-white">
              {badge.label}
            </span>
          </div>

          {resource.isLockedUntilTestPass ? (
            isLocked ? (
              <span className="ui-badge ui-badge-warning text-[10px]">
                <Lock className="w-3 h-3" /> Bloqueado
              </span>
            ) : (
              <span className="ui-badge ui-badge-success text-[10px]">
                <CheckCircle2 className="w-3 h-3" /> Habilitado
              </span>
            )
          ) : (
            <span className="ui-badge ui-badge-neutral text-[10px]">Libre</span>
          )}
        </div>

        {/* Título */}
        <h4 className="text-xs font-semibold text-white leading-snug mb-1 line-clamp-2">
          {resource.title}
        </h4>

        {/* Descripción */}
        <p className="text-[11px] text-[#C4C4C4] mb-3 leading-relaxed">
          {isLocked
            ? 'Requiere aprobar la evaluación normativa para habilitar la descarga.'
            : 'Formato institucional listo para descarga y llenado.'}
        </p>

        {errorMsg && (
          <div className="mb-2 p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-[11px] flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10">
        <span className="text-[10px] text-[#C4C4C4] font-mono uppercase">
          {resource.fileType}
        </span>

        <div className="flex items-center gap-1.5">
          {canManage && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              title="Eliminar plantilla"
              className="p-1 rounded-lg text-[#C4C4C4] hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            disabled={isLocked || isDownloading}
            className={`ui-btn text-xs h-7.5 px-2.5 gap-1 ${
              isLocked
                ? 'ui-btn-secondary opacity-50 cursor-not-allowed'
                : 'ui-btn-primary'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-3 h-3" /> Bloqueado
              </>
            ) : (
              <>
                <Download className="w-3 h-3" /> Descargar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
