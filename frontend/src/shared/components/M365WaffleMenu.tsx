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
      desc: 'Landing del Ing. Wilfrido',
      icon: Home,
      color: 'bg-[#0f6cbd] text-white',
    },
    {
      id: 'practicas',
      name: 'Prácticas',
      desc: 'Bitácoras y convenios RRA',
      icon: FileText,
      color: 'bg-[#0078d4] text-white',
    },
    {
      id: 'vinculacion',
      name: 'Vinculación',
      desc: 'Proyectos con la comunidad',
      icon: Users,
      color: 'bg-[#744da9] text-white',
    },
    {
      id: 'eventos',
      name: 'Eventos & QR',
      desc: 'Conferencias y asistencia',
      icon: Calendar,
      color: 'bg-[#107c10] text-white',
    },
    {
      id: 'certificados',
      name: 'Certificados',
      desc: 'Emisión y verificación SHA-256',
      icon: Award,
      color: 'bg-[#d83b01] text-white',
    },
    {
      id: 'espacios',
      name: 'Espacios',
      desc: 'Catálogo de cohortes',
      icon: Layers,
      color: 'bg-[#008272] text-white',
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-transparent" onClick={onClose} />

      <div className="absolute left-3 top-13 z-50 w-72 bg-white border border-[#e0e0e0] rounded-lg shadow-xl p-4 text-[#242424] animate-fadeIn select-none">
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#edebe9]">
          <span className="text-xs font-semibold text-[#242424]">
            Aplicaciones de Microsoft 365
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#616161] hover:text-[#242424] p-1 rounded-md hover:bg-[#f0f0f0] transition-colors"
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
                className="flex flex-col items-start p-2.5 rounded-lg border border-transparent hover:border-[#e0e0e0] hover:bg-[#f5f5f5] transition-all text-left group cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-2 shadow-2xs ${app.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#242424] group-hover:text-[#0f6cbd] leading-tight">
                  {app.name}
                </span>
                <span className="text-[10px] text-[#616161] leading-tight mt-0.5 line-clamp-1">
                  {app.desc}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#edebe9] text-[11px] text-[#0f6cbd] font-semibold flex items-center justify-between px-1">
          <span>Plataforma Académica Soberana</span>
          <span>v2.0</span>
        </div>
      </div>
    </>
  );
};
