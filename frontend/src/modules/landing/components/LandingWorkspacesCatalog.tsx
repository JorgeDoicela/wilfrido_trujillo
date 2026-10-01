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

  const getTypeName = (type: string) => {
    switch (type) {
      case 'PRACTICAS':
        return 'Prácticas Laborales';
      case 'VINCULACION':
        return 'Vinculación Social';
      case 'EVENTO':
        return 'Conferencia / Taller';
      default:
        return type;
    }
  };

  return (
    <section id="espacios" className="py-14 sm:py-20 bg-white border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-[#616161] uppercase tracking-wider block mb-1">
              Periodos y Talleres Activos
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424]">
              Catálogo de Espacios Académicos
            </h2>
            <p className="text-xs sm:text-sm text-[#616161] mt-1.5">
              Aulas de coordinación y periodos lectivos habilitados para gestión de estudiantes.
            </p>
          </div>

          {/* Filtros por Categoría */}
          <div className="flex items-center gap-1 border border-[#d1d1d1] rounded p-1 bg-white">
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
                className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#0f6cbd] text-white font-semibold'
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
          <div className="p-8 text-center text-xs text-[#616161] bg-[#f5f5f5] rounded border border-[#e0e0e0]">
            No hay espacios registrados bajo este criterio.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((ws) => (
              <div
                key={ws.id}
                className="p-5 bg-white border border-[#e0e0e0] rounded-lg flex flex-col justify-between hover:border-[#0f6cbd] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-[#edebe9] pb-2">
                    <span className="text-xs font-semibold text-[#0f6cbd]">
                      {getTypeName(ws.type)}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-mono text-[#616161]">
                      <KeyRound className="w-3 h-3 text-[#616161]" />
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
                  <span className="text-xs text-[#616161]">
                    Habilitado
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectWorkspace(ws)}
                    className="px-3 py-1 rounded border border-[#d1d1d1] text-xs font-semibold text-[#242424] hover:bg-[#f5f5f5] flex items-center gap-1 cursor-pointer"
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
