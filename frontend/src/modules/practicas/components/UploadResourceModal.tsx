import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, Lock } from 'lucide-react';
import { resourcesApi } from '../api/resources.api';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
} from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
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
        formData.append(
          'fileUrl',
          `${title.replace(/\s+/g, '_').toLowerCase()}.${fileType === 'excel' ? 'xlsx' : fileType === 'word' ? 'docx' : 'pdf'}`,
        );
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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <ModalHeader onClose={onClose}>
        <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <ModalTitle>Subir Plantilla Oficial</ModalTitle>
          <p className="text-xs text-slate-400 font-normal">Espacio: {workspaceTitle}</p>
        </div>
      </ModalHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ModalContent>
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Input
            label="Nombre de la Plantilla o Formato"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Plan de Aprendizaje y Convenio (Formato A1)"
            required
          />

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-300 block">Tipo de Documento</span>
            <div className="grid grid-cols-3 gap-2">
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
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-1.5">Archivo Digital</span>
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
                <p className="text-xs text-emerald-400 font-semibold truncate">
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
              className="h-4 w-4 rounded accent-emerald-500 mt-1 cursor-pointer"
            />
          </div>
        </ModalContent>

        <ModalFooter>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
          >
            Publicar Plantilla
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
