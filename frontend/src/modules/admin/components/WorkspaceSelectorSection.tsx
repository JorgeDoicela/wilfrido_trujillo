import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { JoinWorkspaceCard } from '@/shared/components/JoinWorkspaceCard';
import { WorkspaceCard } from './WorkspaceCard';
import { Can } from '@/shared/components/Can';
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
    <section className="m365-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#edebe9]">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-[#0f6cbd]" />
          <h3 className="text-sm font-semibold text-[#242424]">
            Catálogo de Espacios y Periodos Académicos ({workspaces.length})
          </h3>
        </div>

        <Can do="workspace:create">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="m365-btn m365-btn-primary text-xs h-7.5 px-2.5"
          >
            <Plus className="w-3.5 h-3.5" /> Nuevo Espacio
          </button>
        </Can>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Formulario de Unirse a un Espacio por Código */}
        <div className="lg:col-span-1">
          <JoinWorkspaceCard onJoinSuccess={onJoinSuccess} />
        </div>

        {/* Listado de Espacios */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-[#616161]">
              Cargando espacios de trabajo oficiales...
            </div>
          ) : workspaces.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#616161] bg-[#fafafa] rounded-lg border border-[#e0e0e0]">
              No hay espacios registrados actualmente.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
