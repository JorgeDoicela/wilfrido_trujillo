import { ArrowRight } from 'lucide-react';

export interface LandingNavbarProps {
  onEnterPortal: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onEnterPortal }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e0e0e0] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Identidad Institucional */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#0f6cbd] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            WT
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#242424] leading-tight">
              Ing. Wilfrido Trujillo
            </span>
            <span className="text-[11px] text-[#616161]">
              Plataforma Académica & Gestión Soberana
            </span>
          </div>
        </div>

        {/* Enlaces de Navegación de Anclaje */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#616161]">
          <a
            href="#pilares"
            className="hover:text-[#0f6cbd] transition-colors py-1 cursor-pointer"
          >
            Pilares de Gestión
          </a>
          <a
            href="#flujo-rra"
            className="hover:text-[#0f6cbd] transition-colors py-1 cursor-pointer"
          >
            Flujo Normativo RRA
          </a>
          <a
            href="#acceso-rapido"
            className="hover:text-[#0f6cbd] transition-colors py-1 cursor-pointer"
          >
            Validar & Acceso
          </a>
          <a
            href="#espacios"
            className="hover:text-[#0f6cbd] transition-colors py-1 cursor-pointer"
          >
            Espacios Lectivos
          </a>
          <a
            href="#perfil"
            className="hover:text-[#0f6cbd] transition-colors py-1 cursor-pointer"
          >
            Perfil Académico
          </a>
        </nav>

        {/* Botón CTA a la Suite M365 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEnterPortal}
            className="m365-btn m365-btn-primary text-xs h-9 px-3.5 gap-2 shadow-sm"
          >
            <span>Acceder a la Suite M365</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
