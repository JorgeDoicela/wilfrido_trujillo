import React from 'react';
import { ArrowRight, Search } from 'lucide-react';

export interface LandingHeroProps {
  onEnterPortal: () => void;
  onScrollToValidator: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onEnterPortal,
  onScrollToValidator,
}) => {
  return (
    <section className="w-full pt-28 sm:pt-36 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
      {/* 1. Rótulo Institucional Limpio y Sobrio (Sin pastillas ni fondos de color) */}
      <span className="text-xs font-semibold tracking-wider text-[#616161] uppercase mb-4">
        Universidad Nacional de Chimborazo · Facultad de Ingeniería
      </span>

      {/* 2. Titular Principal en Segoe UI */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#242424] max-w-4xl leading-[1.08] mb-3">
        Ing. Wilfrido Trujillo
      </h1>

      {/* 3. Subtitular de Cargo */}
      <p className="text-lg sm:text-2xl font-semibold text-[#0f6cbd] tracking-tight max-w-3xl mb-4">
        Coordinación de Prácticas Preprofesionales, Vinculación y Eventos Oficiales
      </p>

      {/* 4. Descripción Operativa Concreta (Sin relleno publicitario) */}
      <p className="text-sm sm:text-base text-[#616161] max-w-2xl font-normal leading-relaxed mb-8">
        Sistema oficial para la acreditación de horas prácticas, seguimiento de proyectos comunitarios, verificación documental de informes y validación criptográfica de certificados conforme al Reglamento de Régimen Académico.
      </p>

      {/* 5. Acciones Principales */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
        <button
          type="button"
          onClick={onEnterPortal}
          className="w-full sm:w-auto px-6 py-2.5 rounded bg-[#0f6cbd] text-white font-semibold text-sm hover:bg-[#115ea3] active:bg-[#0c3b5e] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Acceder a la Suite M365</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onScrollToValidator}
          className="w-full sm:w-auto px-6 py-2.5 rounded bg-white border border-[#d1d1d1] text-[#242424] font-semibold text-sm hover:bg-[#f5f5f5] active:bg-[#ebebeb] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search className="w-4 h-4 text-[#616161]" />
          <span>Validar Certificado</span>
        </button>
      </div>
    </section>
  );
};
