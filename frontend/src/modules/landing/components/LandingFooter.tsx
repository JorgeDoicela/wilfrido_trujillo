import React from 'react';
import { ArrowUp } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#e0e0e0] py-12 text-xs text-[#616161]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#edebe9]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#0f6cbd] text-white flex items-center justify-center font-bold text-xs select-none shadow-2xs">
              WT
            </div>
            <div>
              <span className="font-bold text-[#242424] block">
                Ing. Wilfrido Trujillo
              </span>
              <span className="text-[11px] text-[#616161]">
                Coordinación Académica de Prácticas, Vinculación y Eventos Oficiales
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs">
            <a href="#pilares" className="hover:text-[#0f6cbd] transition-colors">
              Pilares
            </a>
            <a href="#explorador" className="hover:text-[#0f6cbd] transition-colors">
              Explorador
            </a>
            <a href="#flujo-rra" className="hover:text-[#0f6cbd] transition-colors">
              Flujo RRA
            </a>
            <a href="#servicios" className="hover:text-[#0f6cbd] transition-colors">
              Validar Certificado
            </a>
            <a href="#espacios" className="hover:text-[#0f6cbd] transition-colors">
              Espacios Activos
            </a>
            <a href="#normativa" className="hover:text-[#0f6cbd] transition-colors">
              Marco Ético
            </a>
            <a href="#despacho" className="hover:text-[#0f6cbd] transition-colors">
              Despacho Docente
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#0f6cbd] font-semibold hover:underline cursor-pointer ml-2"
            >
              <span>Volver arriba</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8a8886]">
          <p>
            © {new Date().getFullYear()} Ing. Wilfrido Trujillo · Plataforma Soberana de Gestión Académica · Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4 text-[#8a8886]">
            <span>Cumplimiento LOPDP Ecuador</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Reglamento de Régimen Académico (CES Art. 89)</span>
            <span className="hidden md:inline">|</span>
            <span>Servicios Operativos</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
