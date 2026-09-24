import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, Loader2, Lock } from 'lucide-react';
import { resourcesApi } from '@/modules/practicas/api/resources.api';
import type { ResourceFile } from '@/shared/types/resource.types';

interface UploadResourceModalProps {
  isOpen: boolean;
  workspaceId: string;
  workspaceTitle: string;
  onClose: () => void;
  onSuccess: (resource: ResourceFile) => void;
}

export function UploadResourceModal({
  isOpen,
  workspaceId,
  workspaceTitle,
  onClose,
  onSuccess,
}: UploadResourceModalProps) {
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [isLockedUntilTestPass, setIsLockedUntilTestPass] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        // Auto-sugerir título desde el nombre del archivo
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setTitle(nameWithoutExt.replace(/[_-]/g, ' '));
      }
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') setFileType('pdf');
      else if (ext === 'doc' || ext === 'docx') setFileType('word');
      else if (ext === 'xls' || ext === 'xlsx') setFileType('excel');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Debes indicar el título o nombre oficial del recurso.');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('workspaceId', workspaceId);
      formData.append('title', title.trim());
      formData.append('fileType', fileType);
      formData.append('isLockedUntilTestPass', String(isLockedUntilTestPass));

      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('fileUrl', `${title.replace(/\s+/g, '_').toLowerCase()}.${fileType === 'excel' ? 'xlsx' : fileType === 'word' ? 'docx' : 'pdf'}`);
      }

      const created = await resourcesApi.upload(formData);
      onSuccess(created);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir la plantilla oficial.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Subir Plantilla Oficial</h3>
              <p className="text-xs text-slate-400">Espacio: {workspaceTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Título */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nombre de la Plantilla o Formato
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Plan de Aprendizaje y Convenio (Formato A1)"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Tipo de Documento */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'pdf', label: 'PDF Oficial' },
              { id: 'word', label: 'Word (.docx)' },
              { id: 'excel', label: 'Excel (.xlsx)' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFileType(t.id)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                  fileType === t.id
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm shadow-blue-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Selector de Archivo */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Archivo Digital
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/60 rounded-2xl p-5 text-center cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
              <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              {selectedFile ? (
                <p className="text-xs text-blue-400 font-semibold truncate">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              ) : (
                <>
                  <p className="text-xs font-medium text-slate-300">
                    Haz clic para seleccionar el archivo local
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Admite PDF, Word (.docx) o Excel (.xlsx) hasta 25MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Toggle de Bloqueo Condicional */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold text-white block">
                  Bloquear descarga hasta aprobar examen
                </span>
                <span className="text-[11px] text-slate-400 block leading-relaxed">
                  El alumno no podrá descargar esta plantilla hasta obtener la nota mínima en la evaluación de inducción.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isLockedUntilTestPass}
              onChange={(e) => setIsLockedUntilTestPass(e.target.checked)}
              className="h-4 w-4 rounded accent-blue-600 mt-1 cursor-pointer"
            />
          </div>

          {/* Footer de Acciones */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Subiendo...
                </>
              ) : (
                'Publicar Plantilla'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
