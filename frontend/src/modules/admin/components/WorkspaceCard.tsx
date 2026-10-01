import { useState } from 'react';
import { Copy, Check, GraduationCap, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import type { Workspace } from '@/shared/types/workspace.types';

interface WorkspaceCardProps {
  workspace: Workspace;
  onEnter?: (workspace: Workspace) => void;
}

export function WorkspaceCard({ workspace, onEnter }: WorkspaceCardProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(workspace.accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeConfig = () => {
    switch (workspace.type) {
      case 'PRACTICAS':
        return {
          icon: <GraduationCap className="w-3.5 h-3.5" />,
          label: 'Prácticas',
          className: 'm365-badge--info',
        };
      case 'VINCULACION':
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          label: 'Vinculación',
          className: 'm365-badge--warning',
        };
      case 'EVENTO':
        return {
          icon: <Calendar className="w-3.5 h-3.5" />,
          label: 'Conferencia',
          className: 'm365-badge--success',
        };
    }
  };

  const badge = getBadgeConfig();

  return (
    <div className="m365-card m365-card-hover p-4 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#616161]">
            {badge.icon}
            <span>{badge.label}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span className={`w-1.5 h-1.5 rounded-full ${workspace.isActive ? 'bg-[#107c10]' : 'bg-[#8a8886]'}`} />
            <span className={workspace.isActive ? 'text-[#107c10]' : 'text-[#616161]'}>
              {workspace.isActive ? 'Activo' : 'Archivado'}
            </span>
          </div>
        </div>

        <h4 className="text-sm font-semibold text-[#242424] tracking-tight mb-1 group-hover:text-[#0f6cbd] transition-colors">
          {workspace.title}
        </h4>
        <p className="text-xs text-[#616161] line-clamp-2 leading-relaxed mb-3">
          {workspace.description || 'Sin descripción adicional.'}
        </p>
      </div>

      <div className="pt-2.5 border-t border-[#edebe9] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#616161]">Código:</span>
          <span className="text-xs font-mono font-semibold text-[#242424]">
            {workspace.accessCode}
          </span>
          <button
            type="button"
            onClick={copyCode}
            title="Copiar código de acceso"
            className="p-1 rounded-md text-[#616161] hover:text-[#242424] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3 h-3 text-[#107c10]" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        {onEnter && (
          <button
            type="button"
            onClick={() => onEnter(workspace)}
            className="text-xs text-[#0f6cbd] hover:text-[#115ea3] font-semibold flex items-center gap-1 cursor-pointer"
          >
            Abrir <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
