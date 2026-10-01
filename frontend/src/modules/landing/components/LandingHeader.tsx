import React from 'react';
import { ArrowRight } from 'lucide-react';
import { QuitoClockBadge } from './QuitoClockBadge';
import { useLandingHeaderScroll } from '../hooks/useLandingHeaderScroll';

export interface LandingHeaderProps {
  onEnterPortal: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onEnterPortal }) => {
  const isVisible = useLandingHeaderScroll();

  return (
    <header
      aria-hidden={!isVisible}
      className={`fixed top-5 left-5 right-5 sm:top-6 sm:left-8 sm:right-8 md:top-7 md:left-10 md:right-10 z-50 flex items-center justify-between pointer-events-none transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity] ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100'
          : '-translate-y-12 sm:-translate-y-14 opacity-0 scale-[0.98] pointer-events-none'
      }`}
    >
      {/* Controles Izquierda: Logotipo e Identidad (Clic vuelve arriba) */}
      <div className={`flex items-center gap-2.5 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 outline-none hover:opacity-80 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Ing. Wilfrido Trujillo - Inicio"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0f6cbd] text-white flex items-center justify-center font-bold text-xs shadow-xs select-none">
            WT
          </div>
          <span className="text-sm font-semibold tracking-tight text-[#242424]">
            Ing. Wilfrido Trujillo
          </span>
        </a>
      </div>

      {/* Controles Derecha: Reloj de Riobamba y Botón de Acceso */}
      <div className={`flex items-center gap-3 sm:gap-4 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <QuitoClockBadge />
        <div className="hidden sm:block w-px h-4 bg-[#e0e0e0]" aria-hidden="true" />
        <button
          type="button"
          onClick={onEnterPortal}
          className="px-4 py-2 rounded-full bg-[#0f6cbd] text-white text-xs font-semibold hover:bg-[#115ea3] active:scale-95 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <span>Acceder</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};

export default LandingHeader;
