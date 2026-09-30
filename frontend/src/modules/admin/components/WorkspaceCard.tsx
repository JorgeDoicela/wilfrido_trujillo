import { useState } from 'react';
import { Copy, Check, GraduationCap, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
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
          className: 'fluent-badge--info',
        };
      case 'VINCULACION':
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          label: 'Vinculación',
          className: 'fluent-badge--warning',
        };
      case 'EVENTO':
        return {
          icon: <Calendar className="w-3.5 h-3.5" />,
          label: 'Conferencia / Evento',
          className: 'fluent-badge--success',
        };
    }
  };

  const badge = getBadgeConfig();

  return (
    <Card className="hover:border-[#c8c6c4] flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className={`fluent-badge ${badge.className}`}>
            {badge.icon} {badge.label}
          </span>
          <span className={`fluent-badge ${workspace.isActive ? 'fluent-badge--success' : 'fluent-badge--neutral'}`}>
            {workspace.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <h4 className="text-sm font-bold text-[#1a1a1a] tracking-tight mb-1 group-hover:text-[#1b2a4a] transition-colors">
          {workspace.title}
        </h4>
        <p className="text-xs text-[#605e5c] line-clamp-2 leading-relaxed mb-3">
          {workspace.description || 'Sin descripción adicional.'}
        </p>
      </div>

      <div className="pt-2.5 border-t border-[#e5e7eb] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#605e5c]">Código:</span>
          <code>{workspace.accessCode}</code>
          <button
            type="button"
            onClick={copyCode}
            title="Copiar código de acceso"
            className="p-1 rounded-[2px] text-[#605e5c] hover:text-[#1a1a1a] hover:bg-[#faf9f8] transition-colors cursor-pointer"
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
            className="text-xs text-[#0078d4] hover:text-[#106ebe] font-medium flex items-center gap-1 cursor-pointer"
          >
            Abrir <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </Card>
  );
}
