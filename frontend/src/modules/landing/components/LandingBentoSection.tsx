import React from 'react';
import { BentoCard } from './BentoCard';
import { ExternalLink, ArrowRight } from 'lucide-react';

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
      {/* Tarjeta 1: Canales & Enlaces */}
      <BentoCard className="p-8 md:p-12 flex flex-col justify-between min-h-[420px]">
        <div className="flex flex-col gap-2 mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#242424]">
            Canales & Enlaces Oficiales
          </h3>
          <p className="text-[#616161] text-sm sm:text-base font-normal leading-relaxed">
            Accesos directos a los sistemas institucionales y servicios de la carrera.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onEnterPortal}
            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#f5f5f5] text-xs sm:text-sm font-medium text-[#616161] hover:text-[#242424] transition-colors border border-transparent hover:border-[#e0e0e0] cursor-pointer text-left"
          >
            <span>Acceso a la Suite M365</span>
            <span className="text-xs text-[#0f6cbd] font-semibold flex items-center gap-1">
              <span>Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <a
            href="https://unach.edu.ec"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#f5f5f5] text-xs sm:text-sm font-medium text-[#616161] hover:text-[#242424] transition-colors border border-transparent hover:border-[#e0e0e0] cursor-pointer"
          >
            <span>unach.edu.ec</span>
            <span className="text-xs text-[#616161] flex items-center gap-1">
              <span>UNACH</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>

          <a
            href="https://sicoa.unach.edu.ec"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#f5f5f5] text-xs sm:text-sm font-medium text-[#616161] hover:text-[#242424] transition-colors border border-transparent hover:border-[#e0e0e0] cursor-pointer"
          >
            <span>sicoa.unach.edu.ec</span>
            <span className="text-xs text-[#616161] flex items-center gap-1">
              <span>SICOA</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>

          <button
            type="button"
            onClick={onVerifyCertificate}
            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#f5f5f5] text-xs sm:text-sm font-medium text-[#616161] hover:text-[#242424] transition-colors border border-transparent hover:border-[#e0e0e0] cursor-pointer text-left"
          >
            <span>Validación de Certificados SHA-256</span>
            <span className="text-xs text-[#0f6cbd] font-semibold">Público</span>
          </button>
        </div>
      </BentoCard>

      {/* Tarjeta 2: Filosofía & Enfoque */}
      <BentoCard className="p-8 md:p-12 flex flex-col justify-between min-h-[420px]">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#242424]">
            Filosofía Académica
          </h3>
        </div>

        <div className="my-auto py-6 sm:py-10">
          <blockquote className="text-sm sm:text-base italic text-[#424242] leading-relaxed font-normal border-l-2 border-[#0f6cbd] pl-4 sm:pl-5">
            &ldquo;La formación en ingeniería demanda una articulación indisoluble entre la destreza técnica, la rigurosidad metodológica y la ética profesional. Cada práctica en territorio y cada informe técnico auditado constituyen la prueba fehaciente del compromiso universitario con el desarrollo productivo y soberano de nuestro país.&rdquo;
          </blockquote>
        </div>

        <div className="pt-6 border-t border-[#edebe9] flex items-center justify-between text-xs text-[#616161]">
          <span>Ing. Wilfrido Trujillo, M.Sc.</span>
          <span className="font-semibold text-[#242424]">Facultad de Ingeniería · UNACH</span>
        </div>
      </BentoCard>
    </section>
  );
};
