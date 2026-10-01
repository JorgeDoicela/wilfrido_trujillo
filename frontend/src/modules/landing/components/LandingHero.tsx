import React from 'react';
import { ArrowRight, ShieldCheck, QrCode, FileText, CheckCircle2, Award } from 'lucide-react';

export interface LandingHeroProps {
  onEnterPortal: () => void;
  onScrollToValidator: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onEnterPortal,
  onScrollToValidator,
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-[#e0e0e0] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Columna Izquierda: Información de Impacto */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Badges de Confianza Institucional */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="m365-badge m365-badge--info">
                <ShieldCheck className="w-3 h-3" /> Normativa RRA — CES Ecuador
              </span>
              <span className="m365-badge m365-badge--success">
                <QrCode className="w-3 h-3" /> Acreditación QR SHA-256
              </span>
              <span className="m365-badge">
                Soberanía & LOPDP Ecuador
              </span>
            </div>

            {/* Titular Principal */}
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#242424] tracking-tight leading-tight">
                Gestión Académica Soberana, Prácticas y Vinculación
              </h1>
              <p className="text-sm sm:text-base text-[#616161] leading-relaxed max-w-2xl">
                Plataforma personal y soberana del <strong className="text-[#242424]">Ing. Wilfrido Trujillo</strong> para la coordinación de carreras, inducción obligatoria, desbloqueo de plantillas oficiales, auditoría documental de bitácoras y certificación digital verificable.
              </p>
            </div>

            {/* Acciones Principales */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onEnterPortal}
                className="m365-btn m365-btn-primary text-xs sm:text-sm h-10 px-5 gap-2 shadow-sm"
              >
                <span>Ingresar a la Plataforma</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onScrollToValidator}
                className="m365-btn m365-btn-secondary text-xs sm:text-sm h-10 px-4.5 gap-2"
              >
                <QrCode className="w-4 h-4 text-[#0f6cbd]" />
                <span>Verificar un Certificado</span>
              </button>
            </div>

            {/* Métricas de Calidad Operativa */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#edebe9] text-xs">
              <div>
                <span className="block text-xl font-bold text-[#0f6cbd]">100%</span>
                <span className="text-[#616161] mt-0.5 block">Inducción guiada en video</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-[#107c10]">7.0 / 10</span>
                <span className="text-[#616161] mt-0.5 block">Nota mínima en test RRA</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-[#242424]">SHA-256</span>
                <span className="text-[#616161] mt-0.5 block">Firma inmutable en diplomas</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Resumen Arquitectónico Soberano */}
          <div className="lg:col-span-5">
            <div className="m365-card p-6 bg-[#fafafa] border border-[#e0e0e0] shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#edebe9]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-[#ebf3fc] text-[#0f6cbd] flex items-center justify-center font-bold text-xs">
                    RRA
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#242424]">
                      Control Académico de Procesos
                    </h3>
                    <span className="text-[10px] text-[#616161]">
                      Reglamento de Régimen Académico
                    </span>
                  </div>
                </div>
                <span className="m365-badge m365-badge--success text-[10px]">
                  En Operación
                </span>
              </div>

              {/* Lista de Garantías */}
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white rounded-md border border-[#edebe9] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#107c10] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#242424] block">Soberanía de Datos Privada</strong>
                    <span className="text-[#616161] text-[11px]">
                      Independiente de servidores de terceros y en estricto cumplimiento con la LOPDP Ecuador.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-md border border-[#edebe9] flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-[#0f6cbd] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#242424] block">Auditoría Documental Heurística</strong>
                    <span className="text-[#616161] text-[11px]">
                      Inspección estructural de PDFs, conteo de páginas, firmas normativas y rúbrica RRA.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-md border border-[#edebe9] flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-[#7d5a00] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#242424] block">Acreditación con Matriz QR</strong>
                    <span className="text-[#616161] text-[11px]">
                      Certificados de conferencias y talleres consultables públicamente sin fricción.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
