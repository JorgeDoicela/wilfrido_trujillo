import React from 'react';
import { Video, HelpCircle, FolderArchive, FileCheck2 } from 'lucide-react';

export const LandingRraFlow: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Inducción en Video',
      subtitle: 'Comprensión Integral 100%',
      icon: Video,
      desc: 'El estudiante visualiza la inducción oficial. El sistema valida el tiempo de visualización para certificar el conocimiento de las directrices.',
      badge: 'Fase Inicial',
    },
    {
      num: 2,
      title: 'Test Normativo',
      subtitle: 'Aprobación Mínima 7.0/10',
      icon: HelpCircle,
      desc: 'Cuestionario basado en el reglamento RRA del CES. Evalúa obligaciones éticas, plazos de entrega y requisitos de legalización.',
      badge: 'Evaluación',
    },
    {
      num: 3,
      title: 'Formatos Oficiales',
      subtitle: 'Descarga Habilitada',
      icon: FolderArchive,
      desc: 'Acceso a las plantillas membretadas oficiales: convenios interinstitucionales, plan de aprendizaje y bitácoras semanales.',
      badge: 'Documentación',
    },
    {
      num: 4,
      title: 'Auditoría & Entrega',
      subtitle: 'Dictamen Heurístico',
      icon: FileCheck2,
      desc: 'Carga del informe final en PDF. El motor auditor comprueba páginas, estructura y firmas antes del visado definitivo del docente.',
      badge: 'Cierre',
    },
  ];

  return (
    <section id="flujo-rra" className="py-14 sm:py-20 bg-[#f5f5f5] border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#616161] uppercase tracking-wider block mb-1">
            Proceso Secuencial
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#242424]">
            Flujo Normativo para Estudiantes
          </h2>
          <p className="text-xs sm:text-sm text-[#616161] mt-1.5 leading-relaxed">
            Mecanismo estructurado para garantizar el cumplimiento reglamentario previo y posterior a la ejecución de prácticas.
          </p>
        </div>

        {/* Pasos en Cuadrícula Limpia */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-5 bg-white border border-[#e0e0e0] rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-[#edebe9] pb-2">
                    <span className="text-xs font-bold text-[#0f6cbd]">
                      0{step.num}
                    </span>
                    <span className="text-xs text-[#616161]">
                      {step.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-[#0f6cbd]" />
                    <h3 className="text-sm font-bold text-[#242424]">{step.title}</h3>
                  </div>

                  <span className="text-xs font-semibold text-[#616161] block mb-2">
                    {step.subtitle}
                  </span>

                  <p className="text-xs text-[#616161] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#edebe9] text-xs text-[#616161] flex items-center justify-between">
                  <span>Etapa {step.num} de 4</span>
                  <span className="text-[#0f6cbd] font-semibold">Obligatorio</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
