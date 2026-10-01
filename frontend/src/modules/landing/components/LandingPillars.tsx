import React from 'react';
import {
  GraduationCap,
  Users,
  Presentation,
  CheckCircle2,
} from 'lucide-react';

export const LandingPillars: React.FC = () => {
  const pillars = [
    {
      id: 'practicas',
      title: 'Prácticas Preprofesionales (PPP)',
      badge: 'Normativa RRA Art. 89-94',
      badgeType: 'info',
      icon: GraduationCap,
      description:
        'Acompañamiento integral en el cumplimiento de horas laborales obligatorias en empresas públicas y privadas.',
      features: [
        'Inducción guiada en video con control estricto de reproducción.',
        'Evaluación diagnóstica sobre el reglamento de prácticas.',
        'Desbloqueo de plantillas oficiales de convenio y bitácoras.',
        'Bandeja oficial de entrega con auditoría de firmas y páginas.',
      ],
      highlight: 'Flujo secuencial con pre-auditoría documental.',
    },
    {
      id: 'vinculacion',
      title: 'Vinculación con la Sociedad',
      badge: 'Servicio Comunitario CES',
      badgeType: 'success',
      icon: Users,
      description:
        'Coordinación de proyectos sociales donde los estudiantes aplican sus conocimientos en beneficio de la comunidad.',
      features: [
        'Registro y seguimiento de proyectos comunitarios aprobados.',
        'Consignación periódica de bitácoras de campo y evidencias.',
        'Validación de asistencia y horas operativas de servicio.',
        'Expediente final digitalizado para acreditación de grado.',
      ],
      highlight: 'Seguimiento de metas e impacto territorial.',
    },
    {
      id: 'conferencias',
      title: 'Conferencias, Talleres & Certificados',
      badge: 'Acreditación QR SHA-256',
      badgeType: 'neutral',
      icon: Presentation,
      description:
        'Ponencias magistrales, masterclasses y capacitaciones técnicas especializadas en ingeniería y educación superior.',
      features: [
        'Acceso instantáneo mediante proyección de código QR.',
        'Descarga directa de diapositivas y código de demostración.',
        'Evaluación rápida o encuesta de satisfacción en vivo.',
        'Emisión soberana de certificados en PDF A4 Landscape.',
      ],
      highlight: 'Diplomas verificables públicamente por terceros.',
    },
  ];

  return (
    <section id="pilares" className="py-16 bg-white border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold text-[#0f6cbd] uppercase tracking-wider">
            Arquitectura de Gestión Soberana
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] mt-1.5">
            Los Tres Ejes Operativos de la Coordinación
          </h2>
          <p className="text-xs sm:text-sm text-[#616161] mt-2 leading-relaxed">
            Estandarización de procesos pedagógicos para erradicar canales informales, asegurar el cumplimiento del Reglamento de Régimen Académico y brindar una experiencia académica de nivel corporativo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="m365-card p-6 bg-white border border-[#e0e0e0] flex flex-col justify-between hover:border-[#0f6cbd] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-md bg-[#ebf3fc] text-[#0f6cbd] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`m365-badge ${
                        pillar.badgeType === 'info'
                          ? 'm365-badge--info'
                          : pillar.badgeType === 'success'
                          ? 'm365-badge--success'
                          : ''
                      }`}
                    >
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#242424] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#616161] leading-relaxed mb-4">
                    {pillar.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#edebe9]">
                    {pillar.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#242424]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#107c10] flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#edebe9] text-[11px] text-[#0f6cbd] font-semibold flex items-center justify-between">
                  <span>{pillar.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
