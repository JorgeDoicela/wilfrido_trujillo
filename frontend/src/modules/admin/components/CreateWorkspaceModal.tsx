import { useState } from 'react';
import { X, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { workspacesApi } from '../api/workspaces.api';
import type { Workspace, WorkspaceType } from '@/shared/types/workspace.types';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (workspace: Workspace) => void;
}

export function CreateWorkspaceModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateWorkspaceModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<WorkspaceType>('PRACTICAS');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || title.trim().length < 3) {
      setErrorMessage('El título debe tener al menos 3 caracteres.');
      return;
    }

    try {
      setIsLoading(true);
      const newWorkspace = await workspacesApi.create({
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        accessCode: accessCode.trim() ? accessCode.trim().toUpperCase() : undefined,
      });

      onSuccess(newWorkspace);
      setTitle('');
      setDescription('');
      setAccessCode('');
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string | string[] } } };
      const msg = error.response?.data?.message;
      setErrorMessage(
        Array.isArray(msg) ? msg.join(', ') : msg || 'Error al crear el espacio de trabajo.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Plus className="w-5 h-5 text-blue-400" />
            <h3>Crear Nuevo Espacio de Trabajo</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="ws-title" className="block text-xs font-medium text-slate-300 mb-1">
              Título del Espacio *
            </label>
            <input
              id="ws-title"
              type="text"
              required
              placeholder="Ej: Prácticas Preprofesionales 2026-I"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="ws-type" className="block text-xs font-medium text-slate-300 mb-1">
              Tipo de Espacio *
            </label>
            <select
              id="ws-type"
              value={type}
              onChange={(e) => setType(e.target.value as WorkspaceType)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            >
              <option value="PRACTICAS">Prácticas Preprofesionales</option>
              <option value="VINCULACION">Vinculación con la Sociedad</option>
              <option value="EVENTO">Conferencia / Evento / Taller</option>
            </select>
          </div>

          <div>
            <label htmlFor="ws-desc" className="block text-xs font-medium text-slate-300 mb-1">
              Descripción o Directrices
            </label>
            <textarea
              id="ws-desc"
              rows={3}
              placeholder="Objetivos, directrices o requisitos del periodo académico..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          <div>
            <label htmlFor="ws-code" className="block text-xs font-medium text-slate-300 mb-1">
              Código de Acceso Personalizado (Opcional)
            </label>
            <input
              id="ws-code"
              type="text"
              placeholder="Dejar vacío para autogenerar (ej: PRAC-2026)"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm uppercase font-mono tracking-wider focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Este código se compartirá con los estudiantes o asistentes para ingresar.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Creando...
                </>
              ) : (
                'Crear Espacio'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
