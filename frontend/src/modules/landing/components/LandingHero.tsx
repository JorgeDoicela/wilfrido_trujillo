import React from 'react';
import { ArrowRight, Search, ShieldCheck, CheckCircle2, Award, FileCheck2 } from 'lucide-react';

export interface LandingHeroProps {
  onEnterPortal: () => void;
  onScrollToValidator: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onEnterPortal,
  onScrollToValidator,
}) => {
  return (
    <section className="relative w-full pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden">
      {/* Halo de fondo corporativo Fluent */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-[#cfe4fa]/40 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* 1. Micro-Pastilla de Estado Oficial RRA */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ebf3fc] border border-[#cfe4fa] text-[#0f6cbd] text-xs font-semibold tracking-wide uppercase mb-6 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-[#0f6cbd] animate-pulse" />
        <span>Normativa RRA CES Art. 89 · Periodo Académico Activo</span>
      </div>

      {/* 2. Titular Principal de Alto Impacto */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.035em] text-[#242424] max-w-4xl leading-[1.06] mb-3">
        Ing. Wilfrido Trujillo
      </h1>

      {/* 3. Subtitular de Especialidad Institucional */}
      <p className="text-lg sm:text-2xl md:text-2xl font-semibold text-[#0f6cbd] tracking-[-0.02em] max-w-3xl mb-5">
        Coordinación de Prácticas Preprofesionales, Vinculación y Eventos Oficiales
      </p>

      {/* 4. Resumen Ejecutivo */}
      <p className="text-sm sm:text-base md:text-lg text-[#616161] max-w-2xl font-normal leading-relaxed tracking-tight mb-8">
        Ecosistema unificado para la acreditación de 240 horas laborales, gestión de proyectos de servicio comunitario y auditoría documental de informes técnicos con validación criptográfica SHA-256.
      </p>

      {/* 5. Botones de Acción Primaria y Secundaria */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mb-12">
        <button
          type="button"
          onClick={onEnterPortal}
          className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#0f6cbd] text-white font-semibold text-sm hover:bg-[#115ea3] active:bg-[#0c3b5e] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Ingresar a la Suite M365</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onScrollToValidator}
          className="w-full sm:w-auto px-6 py-3 rounded-md bg-white border border-[#e0e0e0] text-[#242424] font-semibold text-sm hover:bg-[#f0f0f0] hover:border-[#c7c7c7] active:bg-[#ebebeb] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <Search className="w-4 h-4 text-[#616161]" />
          <span>Validar Certificado con Hash</span>
        </button>
      </div>

      {/* 6. Barra de Acreditación y Garantías Institucionales */}
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#e0e0e0]/70 text-left">
        <div className="flex items-center gap-2.5 p-2 rounded-md bg-white/70 border border-[#edebe9]">
          <ShieldCheck className="w-4 h-4 text-[#0f6cbd] shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#242424] leading-tight">RRA CES Art. 89</span>
            <span className="text-[10px] text-[#616161]">Acreditación 240h</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-md bg-white/70 border border-[#edebe9]">
          <FileCheck2 className="w-4 h-4 text-[#0f6cbd] shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#242424] leading-tight">Auditor Heurístico</span>
            <span className="text-[10px] text-[#616161]">Validación de Informes</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-md bg-white/70 border border-[#edebe9]">
          <Award className="w-4 h-4 text-[#0f6cbd] shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#242424] leading-tight">SHA-256 + QR</span>
            <span className="text-[10px] text-[#616161]">Integridad Criptográfica</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-md bg-white/70 border border-[#edebe9]">
          <CheckCircle2 className="w-4 h-4 text-[#107c10] shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#242424] leading-tight">LOPDP Ecuador</span>
            <span className="text-[10px] text-[#616161]">Privacidad Asegurada</span>
          </div>
        </div>
      </div>
    </section>
  );
};
