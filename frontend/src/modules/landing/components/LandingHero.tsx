import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface LandingHeroProps {
  onEnterPortal: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnterPortal }) => {
  return (
    <section className="w-full min-h-[80dvh] sm:min-h-[85dvh] flex flex-col justify-center items-center text-center px-4 relative">
      {/* Eyebrow simple y limpio */}
      <div className="mb-4">
        <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#616161] uppercase">
          Prácticas Preprofesionales · Vinculación · Certificación
        </span>
      </div>

      {/* Titular Gigante Impactante estilo Apple / Segoe UI Display */}
      <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#242424] max-w-4xl leading-[1.04] mb-6">
        Wilfrido Trujillo
      </h1>

      {/* Párrafo Descriptivo Breve y Directo */}
      <p className="text-base sm:text-lg md:text-xl text-[#616161] max-w-2xl font-normal leading-relaxed mb-10">
        Gestión y supervisión de prácticas laborales, proyectos de vinculación y certificación oficial con validación criptográfica.
      </p>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="#highlights"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById('highlights');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="px-8 py-3.5 rounded-full bg-[#0f6cbd] text-white font-medium text-sm sm:text-base hover:bg-[#115ea3] active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          Explorar lo más destacado
        </a>

        <button
          type="button"
          onClick={onEnterPortal}
          className="px-8 py-3.5 rounded-full bg-white border border-[#d1d1d1] text-[#242424] font-medium text-sm sm:text-base hover:bg-[#f5f5f5] active:scale-95 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <span>Acceder al Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
