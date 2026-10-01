import { Video, HelpCircle, FolderArchive, FileCheck2 } from 'lucide-react';

export const LandingRraFlow: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Inducción en Video',
      subtitle: 'Comprensión Integral 100%',
      icon: Video,
      desc: 'El estudiante visualiza la inducción grabada por el Ingeniero. El reproductor valida el tiempo de reproducción sin saltos para certificar la asimilación de directrices.',
      badge: 'Condición Previa',
    },
    {
      num: 2,
      title: 'Test Normativo',
      subtitle: 'Aprobación Mínima 7.0/10',
      icon: HelpCircle,
      desc: 'Cuestionario interactivo basado en el reglamento RRA del CES. Evalúa responsabilidades éticas, plazos de entrega y requisitos de legalización.',
      badge: 'Filtro de Calidad',
    },
    {
      num: 3,
      title: 'Formatos Oficiales',
      subtitle: 'Desbloqueo Condicional',
      icon: FolderArchive,
      desc: 'Acceso a las plantillas membretadas en Word, Excel y PDF: convenio tripartito, plan de aprendizaje y bitácoras semanales oficiales.',
      badge: 'Recursos Oficiales',
    },
    {
      num: 4,
      title: 'Auditoría & Entrega',
      subtitle: 'Dictamen Heurístico RRA',
      icon: FileCheck2,
      desc: 'Consignación del PDF firmado. El motor auditor valida páginas, texto OCR y firmas antes de que el Ingeniero emita su dictamen (Aprobado u Observado).',
      badge: 'Cierre de Expediente',
    },
  ];

  return (
    <section id="flujo-rra" className="py-16 bg-[#f5f5f5] border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold text-[#0f6cbd] uppercase tracking-wider">
            Embudo Pedagógico Riguroso
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] mt-1.5">
            Flujo Normativo RRA para Estudiantes
          </h2>
          <p className="text-xs sm:text-sm text-[#616161] mt-2 leading-relaxed">
            Mecanismo secuencial diseñado para asegurar que ningún alumno inicie actividades laborales o de servicio comunitario sin haber comprendido sus obligaciones y derechos reglamentarios.
          </p>
        </div>

        {/* Pasos en Cuadrícula Fluent */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="m365-card p-5 bg-white border border-[#e0e0e0] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#0f6cbd] text-white flex items-center justify-center font-bold text-xs">
                      {step.num}
                    </div>
                    <span className="m365-badge text-[10px]">
                      {step.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-[#0f6cbd]" />
                    <h3 className="text-sm font-bold text-[#242424]">{step.title}</h3>
                  </div>

                  <span className="text-[11px] font-semibold text-[#107c10] block mb-2">
                    {step.subtitle}
                  </span>

                  <p className="text-xs text-[#616161] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#edebe9] text-[11px] text-[#616161] flex items-center justify-between">
                  <span>Etapa {step.num} de 4</span>
                  <span className="text-[#0f6cbd] font-semibold">Garantizado</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
