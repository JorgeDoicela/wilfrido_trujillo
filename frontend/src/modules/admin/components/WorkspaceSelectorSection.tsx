import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { JoinWorkspaceCard } from '@/shared/components/JoinWorkspaceCard';
import { WorkspaceCard } from '@/modules/admin/components/WorkspaceCard';
import { Can } from '@/shared/components/Can';
import { Button } from '@/shared/components/ui/Button';
import type { Workspace } from '@/shared/types/workspace.types';

export interface WorkspaceSelectorSectionProps {
  workspaces: Workspace[];
  isLoading: boolean;
  onSelectWorkspace: (workspace: Workspace) => void;
  onOpenCreateModal: () => void;
  onJoinSuccess: (res: { workspace: Workspace }) => void;
}

export const WorkspaceSelectorSection: React.FC<WorkspaceSelectorSectionProps> = ({
  workspaces,
  isLoading,
  onSelectWorkspace,
  onOpenCreateModal,
  onJoinSuccess,
}) => {
  return (
    <section className="max-w-5xl mx-auto w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Formulario de Unirse a un Espacio por Código */}
        <div className="lg:col-span-1">
          <JoinWorkspaceCard onJoinSuccess={onJoinSuccess} />
        </div>

        {/* Listado de Espacios y Botón de Crear */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-semibold text-white">
                Espacios de Trabajo ({workspaces.length})
              </h3>
            </div>

            <Can do="workspace:create">
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenCreateModal}
                className="gap-1.5"
              >
                <Plus className="w-4 h-4" /> Nuevo Espacio
              </Button>
            </Can>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
              Cargando espacios de trabajo...
            </div>
          ) : workspaces.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
              No hay espacios creados aún.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {workspaces.map((ws) => (
                <WorkspaceCard
                  key={ws.id}
                  workspace={ws}
                  onEnter={onSelectWorkspace}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
