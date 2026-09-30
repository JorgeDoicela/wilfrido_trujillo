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
    <section className="bg-white border border-[rgba(0,0,0,0.08)] rounded-[4px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-[#0078d4]" />
          <h3 className="text-sm font-bold text-[#1a1a1a]">
            Catálogo de Espacios y Periodos Académicos ({workspaces.length})
          </h3>
        </div>

        <Can do="workspace:create">
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenCreateModal}
            className="gap-1 text-xs py-1"
          >
            <Plus className="w-3.5 h-3.5" /> Nuevo Espacio
          </Button>
        </Can>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Formulario de Unirse a un Espacio por Código */}
        <div className="lg:col-span-1">
          <JoinWorkspaceCard onJoinSuccess={onJoinSuccess} />
        </div>

        {/* Listado de Espacios */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-[#605e5c]">
              Cargando espacios de trabajo oficiales...
            </div>
          ) : workspaces.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#605e5c] bg-[#faf9f8] rounded-[2px] border border-[#e5e7eb]">
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
