import React from 'react';
import { ArrowRight } from 'lucide-react';
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
      {/* Controles Izquierda: Identidad en Tipografía Pura */}
      <div className={`flex items-center gap-2.5 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col text-left outline-none hover:opacity-85 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Wilfrido Trujillo - Inicio"
        >
          <span className="text-sm font-semibold tracking-tight text-white leading-tight">
            Wilfrido Trujillo
          </span>
          <span className="text-[10px] text-white/60 font-sans tracking-wide">
            Plataforma Académica
          </span>
        </a>
      </div>

      {/* Controles Derecha: Botón de Acceso Limpio */}
      <div className={`${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button
          type="button"
          onClick={onEnterPortal}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/25 border-t-white/50 shadow-xs backdrop-blur-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Acceder al Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};

export default LandingHeader;
