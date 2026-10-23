import React from 'react';
import { BentoCard } from './BentoCard';
import { ArrowRight } from 'lucide-react';

export interface LandingBentoSectionProps {
  onEnterPortal: () => void;
  onVerifyCertificate: () => void;
}

export const LandingBentoSection: React.FC<LandingBentoSectionProps> = ({
  onEnterPortal,
  onVerifyCertificate,
}) => {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      {/* Tarjeta 1: Canales & Accesos Directos */}
      <BentoCard className="min-h-[420px]">
        <div className="flex flex-col gap-2 mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Canales & Accesos Directos
          </h3>
          <p className="text-[#C4C4C4] text-sm sm:text-base font-normal leading-relaxed">
            Plataformas de gestión, seguimiento y verificación en línea.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onEnterPortal}
            className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.12] text-xs sm:text-sm font-medium text-[#F0F0F3] hover:text-white transition-all border border-white/10 hover:border-white/30 hover:border-t-white/60 shadow-xs backdrop-blur-md cursor-pointer text-left"
          >
            <span>Acceso al Portal</span>
            <span className="text-xs text-white font-semibold flex items-center gap-1.5">
              <span>Ingresar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={onEnterPortal}
            className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.12] text-xs sm:text-sm font-medium text-[#F0F0F3] hover:text-white transition-all border border-white/10 hover:border-white/30 hover:border-t-white/60 shadow-xs backdrop-blur-md cursor-pointer text-left"
          >
            <span>Prácticas Preprofesionales</span>
            <span className="text-xs text-white/60 font-mono">Módulo</span>
          </button>

          <button
            type="button"
            onClick={onEnterPortal}
            className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.12] text-xs sm:text-sm font-medium text-[#F0F0F3] hover:text-white transition-all border border-white/10 hover:border-white/30 hover:border-t-white/60 shadow-xs backdrop-blur-md cursor-pointer text-left"
          >
            <span>Vinculación con la Sociedad</span>
            <span className="text-xs text-white/60 font-mono">Módulo</span>
          </button>

          <button
            type="button"
            onClick={onVerifyCertificate}
            className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.12] text-xs sm:text-sm font-medium text-[#F0F0F3] hover:text-white transition-all border border-white/10 hover:border-white/30 hover:border-t-white/60 shadow-xs backdrop-blur-md cursor-pointer text-left"
          >
            <span>Validación de Certificados Oficiales</span>
            <span className="text-xs text-white font-semibold">Consulta</span>
          </button>
        </div>
      </BentoCard>

      {/* Tarjeta 2: Filosofía & Enfoque */}
      <BentoCard className="min-h-[420px]">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Filosofía & Enfoque
          </h3>
        </div>

        <div className="my-auto py-6 sm:py-10">
          <blockquote className="text-sm sm:text-base italic text-[#F0F0F3] leading-relaxed font-normal border-l-2 border-white/40 pl-4 sm:pl-5">
            &ldquo;La ingeniería demanda una articulación indisoluble entre la destreza técnica, la rigurosidad metodológica y la ética profesional. Cada práctica y cada informe técnico auditado constituyen la prueba fehaciente del compromiso con el desarrollo productivo y soberano.&rdquo;
          </blockquote>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#C4C4C4]">
          <span>Wilfrido Trujillo</span>
          <span className="font-semibold text-white">Sistemas & Tecnologías</span>
        </div>
      </BentoCard>
    </section>
  );
};
