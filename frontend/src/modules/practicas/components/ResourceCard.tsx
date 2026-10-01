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
      icon: <FileText className="w-4 h-4 text-[#616161]" />,
    };
  };

  const badge = getFileBadge();

  return (
    <div
      className={`m365-card m365-card-hover p-4 flex flex-col justify-between ${
        isLocked ? 'bg-[#fafafa] opacity-80' : ''
      }`}
    >
      <div>
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-[#fafafa] border border-[#e0e0e0] flex items-center justify-center">
              {badge.icon}
            </div>
            <span className="text-[11px] font-semibold text-[#242424]">
              {badge.label}
            </span>
          </div>

          {resource.isLockedUntilTestPass ? (
            isLocked ? (
              <span className="m365-badge m365-badge--warning text-[10px]">
                <Lock className="w-3 h-3" /> Bloqueado
              </span>
            ) : (
              <span className="m365-badge m365-badge--success text-[10px]">
                <CheckCircle2 className="w-3 h-3" /> Habilitado
              </span>
            )
          ) : (
            <span className="m365-badge m365-badge--neutral text-[10px]">Libre</span>
          )}
        </div>

        {/* Título */}
        <h4 className="text-xs font-semibold text-[#242424] leading-snug mb-1 line-clamp-2">
          {resource.title}
        </h4>

        {/* Descripción */}
        <p className="text-[11px] text-[#616161] mb-3 leading-relaxed">
          {isLocked
            ? 'Requiere aprobar la evaluación normativa para habilitar la descarga.'
            : 'Formato institucional listo para descarga y llenado.'}
        </p>

        {errorMsg && (
          <div className="mb-2 p-2 rounded-md bg-[#fde7e9] border border-[#f1aeb5] text-[#a4262c] text-[11px] flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#edebe9]">
        <span className="text-[10px] text-[#616161] font-mono uppercase">
          {resource.fileType}
        </span>

        <div className="flex items-center gap-1.5">
          {canManage && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              title="Eliminar plantilla"
              className="p-1 rounded-md text-[#616161] hover:text-[#a4262c] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            disabled={isLocked || isDownloading}
            className={`m365-btn text-xs h-7.5 px-2.5 gap-1 ${
              isLocked
                ? 'm365-btn-secondary opacity-60 cursor-not-allowed'
                : 'm365-btn-primary'
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
