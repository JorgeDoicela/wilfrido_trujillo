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

  const getBadgeStyle = () => {
    switch (workspace.type) {
      case 'PRACTICAS':
        return {
          icon: <GraduationCap className="w-3.5 h-3.5" />,
          label: 'Prácticas',
          style: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        };
      case 'VINCULACION':
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          label: 'Vinculación',
          style: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        };
      case 'EVENTO':
        return {
          icon: <Calendar className="w-3.5 h-3.5" />,
          label: 'Conferencia / Evento',
          style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badge.style}`}
          >
            {badge.icon} {badge.label}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-medium ${
              workspace.isActive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {workspace.isActive ? 'Activo' : 'Inactivo'}
          </span>
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
          <button
            type="button"
            onClick={() => onEnter(workspace)}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            Ver espacio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
