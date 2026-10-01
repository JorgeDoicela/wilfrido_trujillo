import React from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#e0e0e0] py-12 text-xs text-[#616161]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#edebe9]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#0f6cbd] text-white flex items-center justify-center font-bold text-xs">
              WT
            </div>
            <div>
              <span className="font-bold text-[#242424] block">
                Ing. Wilfrido Trujillo
              </span>
              <span className="text-[11px] text-[#616161]">
                Coordinación Académica, Prácticas y Vinculación con la Sociedad
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <a href="#pilares" className="hover:text-[#0f6cbd] transition-colors">
              Pilares
            </a>
            <a href="#flujo-rra" className="hover:text-[#0f6cbd] transition-colors">
              Flujo RRA
            </a>
            <a href="#acceso-rapido" className="hover:text-[#0f6cbd] transition-colors">
              Validar Certificado
            </a>
            <a href="#espacios" className="hover:text-[#0f6cbd] transition-colors">
              Espacios
            </a>
            <a href="#perfil" className="hover:text-[#0f6cbd] transition-colors">
              Perfil Docente
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
            © {new Date().getFullYear()} Ing. Wilfrido Trujillo. Plataforma soberana de gestión académica. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#107c10]">
              <ShieldCheck className="w-3.5 h-3.5" /> Cumplimiento LOPDP Ecuador
            </span>
            <span>Reglamento de Régimen Académico (RRA)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
