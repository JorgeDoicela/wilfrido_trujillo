import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface LandingHeroProps {
  onEnterPortal: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnterPortal }) => {
  return (
    <section className="w-full flex flex-col justify-center items-center text-center px-2 sm:px-4 pt-10 sm:pt-14 relative select-none">
      {/* 1. Halo de Luz Cenital Radial Suave (Blanco Difuso y Azul Oficial) */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] sm:w-[650px] h-[320px] rounded-full bg-gradient-to-b from-white/15 via-[#384fa6]/25 to-transparent blur-[120px] pointer-events-none -z-10"
      />

      {/* 2. Subtítulo institucional libre de cápsulas o cercos */}
      <p className="text-xs sm:text-sm font-semibold tracking-widest text-white/80 uppercase font-sans mb-4">
        Régimen Académico CES · Periodo 2026-I
      </p>

      {/* 3. Titular Gigante en Blanco Puro con Bisel Especular */}
      <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white max-w-4xl leading-[1.04] mb-6 drop-shadow-[0_12px_35px_rgba(0,0,0,0.6)]">
        Wilfrido Trujillo
      </h1>

      {/* 4. Subtítulo Informativo en Lenguaje de Dominio */}
      <p className="text-base sm:text-lg md:text-xl text-[#F0F0F3]/90 max-w-2xl font-normal leading-relaxed mb-8 sm:mb-10 drop-shadow-sm">
        Gestión y supervisión de prácticas laborales, proyectos de vinculación y certificación oficial con verificación QR.
      </p>

      {/* 5. Botones de Acción en Cápsula de Cristal */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-14 sm:mb-16">
        <a
          href="#highlights"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById('highlights');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-white/30 via-white/20 to-white/10 hover:from-white/40 hover:to-white/20 text-white font-semibold text-sm sm:text-base border border-white/45 border-t-white/80 shadow-[0_12px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-2xl active:scale-95 transition-all cursor-pointer text-center"
        >
          Ver Módulos
        </a>

        <button
          type="button"
          onClick={onEnterPortal}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-[#F0F0F3] hover:text-white font-medium text-sm sm:text-base border border-white/20 border-t-white/35 shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Acceder al Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 6. Showcase Stage Central: Consola de Cristal Esmerilado por Capas (Layered Glassmorphism) */}
      <div className="w-full max-w-4xl p-5 sm:p-7 md:p-8 rounded-3xl bg-gradient-to-b from-white/[0.10] via-white/[0.04] to-white/[0.02] border border-white/20 border-t-white/50 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)] text-left">
        {/* Barra Superior de la Consola de Cristal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 mb-6 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-white/30 border border-white/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20 border border-white/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20 border border-white/30" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-white uppercase">
              Consola de Acreditación Académica
            </span>
          </div>

          <div className="inline-flex items-center gap-2 text-[11px] font-medium text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>Sistema Operativo</span>
          </div>
        </div>

        {/* Grilla de 3 Módulos de Cristal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Módulo 1: Inducción */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/15 border-t-white/35 backdrop-blur-xl shadow-[0_12px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-white mb-1.5">
                Inducción Normativa
              </h3>
              <p className="text-xs text-[#C4C4C4] leading-relaxed mb-6">
                Capacitación reglamentaria sobre deberes y normativas.
              </p>
            </div>

            <div className="w-full">
              <div className="text-xs text-white mb-2 font-mono">
                100% completado
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-white rounded-full w-full shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
              </div>
            </div>
          </div>

          {/* Módulo 2: Bitácoras */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/15 border-t-white/35 backdrop-blur-xl shadow-[0_12px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-white mb-1.5">
                Bitácoras de Prácticas
              </h3>
              <p className="text-xs text-[#C4C4C4] leading-relaxed mb-6">
                Registro semanal de actividades y supervisión docente.
              </p>
            </div>

            <div className="w-full">
              <div className="text-xs text-white mb-2 font-mono">
                240 / 240 horas
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-white rounded-full w-full shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
              </div>
            </div>
          </div>

          {/* Módulo 3: Certificación */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/15 border-t-white/35 backdrop-blur-xl shadow-[0_12px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-white mb-1.5">
                Certificación Oficial
              </h3>
              <p className="text-xs text-[#C4C4C4] leading-relaxed mb-6">
                Acreditación institucional verificable mediante código QR.
              </p>
            </div>

            <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white">
              <span className="text-[#C4C4C4]">Estado</span>
              <span className="font-semibold text-white">Aprobado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
