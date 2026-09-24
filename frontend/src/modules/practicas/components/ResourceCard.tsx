import { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Download,
  Lock,
  CheckCircle2,
  Trash2,
  Loader2,
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
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      };
    }
    if (type.includes('excel') || type.includes('xls')) {
      return {
        label: 'Hoja Excel',
        icon: <FileSpreadsheet className="w-5 h-5 text-emerald-400" />,
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      };
    }
    if (type.includes('word') || type.includes('doc')) {
      return {
        label: 'Formato Word',
        icon: <FileCode className="w-5 h-5 text-blue-400" />,
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      };
    }
    return {
      label: 'Documento',
      icon: <FileText className="w-5 h-5 text-slate-400" />,
      color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    };
  };

  const badge = getFileBadge();

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
        isLocked
          ? 'bg-slate-900/40 border-slate-800/80 opacity-80 hover:border-amber-500/40'
          : 'bg-slate-900/70 border-slate-800 hover:border-blue-500/50 hover:shadow-xl shadow-lg'
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
              <span
                className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badge.color}`}
              >
                {badge.label}
              </span>
            </div>
          </div>

          {/* Indicador de Candado / Desbloqueo */}
          {resource.isLockedUntilTestPass ? (
            isLocked ? (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300"
                title="Bloqueado hasta aprobar el examen"
              >
                <Lock className="w-3.5 h-3.5" /> Protegido
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                title="Desbloqueado tras aprobar el examen"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Desbloqueado
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400">
              Acceso Libre
            </span>
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
        <button
          type="button"
          onClick={handleDownload}
          disabled={isLocked || isDownloading}
          className={`flex-1 py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isLocked
              ? 'bg-slate-800/60 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
          }`}
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Descargando...
            </>
          ) : isLocked ? (
            <>
              <Lock className="w-3.5 h-3.5" /> Requiere Examen Aprobado
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" /> Descargar Plantilla
            </>
          )}
        </button>

        {canManage && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            title="Eliminar plantilla"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
