import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { QuitoClockBadge } from './QuitoClockBadge';

export interface LandingHeaderProps {
  onEnterPortal: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onEnterPortal }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-[#e0e0e0] shadow-sm py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Identidad Institucional Microsoft 365 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#0f6cbd] text-white flex items-center justify-center font-bold text-sm shadow-xs select-none">
            WT
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#242424] leading-tight tracking-tight">
              Ing. Wilfrido Trujillo
            </span>
            <span className="text-[11px] text-[#616161] font-normal leading-none mt-0.5">
              Coordinación Académica · UNACH
            </span>
          </div>
        </div>

        {/* Navegación por anclas */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#616161]">
          <a
            href="#pilares"
            className="hover:text-[#0f6cbd] transition-colors py-1 cursor-pointer"
          >
            Pilares de Gestión
          </a>
          <a
            href="#explorador"
            className="hover:text-[#0f6cbd] transition-colors py-1 cursor-pointer"
          >
            Explorador por Rol
          </a>
          <a
            href="#servicios"
            className="hover:text-[#0f6cbd] transition-colors py-1 cursor-pointer"
          >
            Validación & Acceso
          </a>
          <a
            href="#normativa"
            className="hover:text-[#0f6cbd] transition-colors py-1 cursor-pointer"
          >
            Marco RRA & Ética
          </a>
          <a
            href="#despacho"
            className="hover:text-[#0f6cbd] transition-colors py-1 cursor-pointer"
          >
            Despacho Docente
          </a>
        </nav>

        {/* Bloque Derecho: Reloj de Riobamba y CTA M365 */}
        <div className="flex items-center gap-3 sm:gap-4">
          <QuitoClockBadge />

          <div className="hidden sm:block w-px h-5 bg-[#e0e0e0]" aria-hidden="true" />

          <button
            type="button"
            onClick={onEnterPortal}
            className="m365-btn m365-btn-primary text-xs h-9 px-3.5 gap-2 shadow-xs cursor-pointer active:scale-98 transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="font-semibold">Acceder a la Suite M365</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>
    </header>
  );
};
