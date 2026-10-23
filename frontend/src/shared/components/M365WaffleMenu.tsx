import React from 'react';
import {
  Home,
  FileText,
  Users,
  Award,
  Calendar,
  Layers,
  X,
} from 'lucide-react';

export interface M365WaffleMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNavTab: (tab: string) => void;
}

export const M365WaffleMenu: React.FC<M365WaffleMenuProps> = ({
  isOpen,
  onClose,
  onSelectNavTab,
}) => {
  if (!isOpen) return null;

  const apps = [
    {
      id: 'inicio',
      name: 'Portada Principal',
      desc: 'Inicio',
      icon: Home,
      color: 'bg-white/20 text-white border border-white/30',
    },
    {
      id: 'practicas',
      name: 'Prácticas',
      desc: 'Bitácoras y convenios RRA',
      icon: FileText,
      color: 'bg-blue-500/25 text-blue-200 border border-blue-500/35',
    },
    {
      id: 'vinculacion',
      name: 'Vinculación',
      desc: 'Proyectos con la comunidad',
      icon: Users,
      color: 'bg-purple-500/25 text-purple-200 border border-purple-500/35',
    },
    {
      id: 'eventos',
      name: 'Eventos & QR',
      desc: 'Conferencias y asistencia',
      icon: Calendar,
      color: 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/35',
    },
    {
      id: 'certificados',
      name: 'Certificados',
      desc: 'Emisión y validación digital',
      icon: Award,
      color: 'bg-amber-500/25 text-amber-200 border border-amber-500/35',
    },
    {
      id: 'espacios',
      name: 'Espacios',
      desc: 'Catálogo de cohortes',
      icon: Layers,
      color: 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/35',
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-transparent" onClick={onClose} />

      <div className="absolute left-3 top-13 z-50 w-72 glass-dropdown p-4 animate-fadeIn select-none shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
          <span className="text-xs font-semibold text-white">
            Aplicaciones
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#C4C4C4] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  if (app.id === 'inicio') {
                    window.location.hash = '';
                  } else {
                    onSelectNavTab(app.id);
                  }
                  onClose();
                }}
                className="flex flex-col items-start p-3 rounded-2xl border border-transparent hover:border-white/25 hover:border-t-white/50 hover:bg-white/[0.12] transition-all text-left group cursor-pointer backdrop-blur-xl hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 shadow-xs backdrop-blur-md ${app.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-semibold text-white group-hover:text-white leading-tight">
                  {app.name}
                </span>
                <span className="text-[10px] text-[#C4C4C4] leading-tight mt-0.5 line-clamp-1">
                  {app.desc}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-[#C4C4C4] font-medium flex items-center justify-between px-1">
          <span>Wilfrido Trujillo</span>
          <span className="text-white/60 font-mono">v2.0</span>
        </div>
      </div>
    </>
  );
};
