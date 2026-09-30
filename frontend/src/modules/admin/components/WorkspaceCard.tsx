import { useState } from 'react';
import { Copy, Check, GraduationCap, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
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
          variant: 'info' as const,
        };
      case 'VINCULACION':
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          label: 'Vinculación',
          variant: 'purple' as const,
        };
      case 'EVENTO':
        return {
          icon: <Calendar className="w-3.5 h-3.5" />,
          label: 'Conferencia / Evento',
          variant: 'success' as const,
        };
    }
  };

  const badge = getBadgeConfig();

  return (
    <Card className="p-5 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={badge.variant}>
            {badge.icon} {badge.label}
          </Badge>
          <Badge variant={workspace.isActive ? 'success' : 'neutral'}>
            {workspace.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>

        <h4 className="text-base font-semibold text-white tracking-tight mb-1 group-hover:text-blue-400 transition-colors">
          {workspace.title}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {workspace.description || 'Sin descripción adicional.'}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500">Código:</span>
          <code className="text-xs font-mono font-bold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {workspace.accessCode}
          </code>
          <button
            type="button"
            onClick={copyCode}
            title="Copiar código de acceso"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {onEnter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEnter(workspace)}
            className="text-xs text-blue-400 hover:text-blue-300 p-0 h-auto hover:bg-transparent"
          >
            Ver espacio <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        )}
      </div>
    </Card>
  );
}
