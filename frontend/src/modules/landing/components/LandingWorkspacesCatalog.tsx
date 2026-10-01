import { useState } from 'react';
import { ArrowRight, KeyRound } from 'lucide-react';
import type { Workspace } from '@/shared/types/workspace.types';

export interface LandingWorkspacesCatalogProps {
  workspaces: Workspace[];
  onSelectWorkspace: (workspace: Workspace) => void;
}

export const LandingWorkspacesCatalog: React.FC<LandingWorkspacesCatalogProps> = ({
  workspaces,
  onSelectWorkspace,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = workspaces.filter((ws) => {
    if (filterType === 'all') return true;
    return ws.type === filterType;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'PRACTICAS':
        return <span className="m365-badge m365-badge--info">Prácticas Laborales</span>;
      case 'VINCULACION':
        return <span className="m365-badge m365-badge--success">Vinculación Social</span>;
      case 'EVENTO':
        return <span className="m365-badge">Conferencia / Taller</span>;
      default:
        return <span className="m365-badge">{type}</span>;
    }
  };

  return (
    <section id="espacios" className="py-16 bg-white border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-[#0f6cbd] uppercase tracking-wider">
              Periodos y Talleres Activos
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] mt-1">
              Catálogo Oficial de Espacios Académicos
            </h2>
            <p className="text-xs sm:text-sm text-[#616161] mt-1">
              Consulta las aulas de coordinación vigentes para el periodo académico lectivo en curso.
            </p>
          </div>

          {/* Filtros por Categoría */}
          <div className="flex items-center gap-1.5 p-1 bg-[#f0f0f0] rounded-lg">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'PRACTICAS', label: 'Prácticas' },
              { id: 'VINCULACION', label: 'Vinculación' },
              { id: 'EVENTO', label: 'Conferencias' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-white text-[#0f6cbd] font-semibold shadow-2xs'
                    : 'text-[#616161] hover:text-[#242424]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listado de Espacios */}
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#616161] bg-[#fafafa] rounded-lg border border-[#e0e0e0]">
            No hay espacios registrados bajo este criterio de filtro.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((ws) => (
              <div
                key={ws.id}
                className="m365-card p-5 bg-white border border-[#e0e0e0] flex flex-col justify-between hover:border-[#0f6cbd] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {getTypeBadge(ws.type)}
                    <span className="flex items-center gap-1 text-[11px] font-mono text-[#616161] bg-[#f0f0f0] px-2 py-0.5 rounded">
                      <KeyRound className="w-3 h-3 text-[#0f6cbd]" />
                      {ws.accessCode}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#242424] mb-1.5 leading-snug">
                    {ws.title}
                  </h3>
                  <p className="text-xs text-[#616161] leading-relaxed line-clamp-3">
                    {ws.description || 'Espacio oficial para gestión académica y recepción de documentos.'}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#edebe9] flex items-center justify-between">
                  <span className="text-[11px] text-[#107c10] font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#107c10]" />
                    Habilitado
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectWorkspace(ws)}
                    className="m365-btn m365-btn-secondary text-xs h-7.5 px-3 gap-1 hover:border-[#0f6cbd] hover:text-[#0f6cbd]"
                  >
                    <span>Ingresar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
