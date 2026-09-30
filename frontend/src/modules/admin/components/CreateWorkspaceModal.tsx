import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { workspacesApi } from '../api/workspaces.api';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
} from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { Input, Textarea, Select } from '@/shared/components/ui/Input';
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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <ModalHeader onClose={onClose}>
        <Plus className="w-5 h-5 text-blue-400" />
        <ModalTitle>Crear Nuevo Espacio de Trabajo</ModalTitle>
      </ModalHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ModalContent>
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Input
            label="Título del Espacio *"
            required
            placeholder="Ej: Prácticas Preprofesionales 2026-I"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Select
            label="Tipo de Espacio *"
            value={type}
            onChange={(e) => setType(e.target.value as WorkspaceType)}
          >
            <option value="PRACTICAS">Prácticas Preprofesionales</option>
            <option value="VINCULACION">Vinculación con la Sociedad</option>
            <option value="EVENTO">Conferencia / Evento / Taller</option>
          </Select>

          <Textarea
            label="Descripción o Directrices"
            rows={3}
            placeholder="Objetivos, directrices o requisitos del periodo académico..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            label="Código de Acceso Personalizado (Opcional)"
            placeholder="Dejar vacío para autogenerar (ej: PRAC-2026)"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            helperText="Este código se compartirá con los estudiantes o asistentes para ingresar."
            className="uppercase font-mono tracking-wider"
          />
        </ModalContent>

        <ModalFooter>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            Crear Espacio
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
