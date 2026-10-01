import React from 'react';
import { GraduationCap, BookOpen, Calendar } from 'lucide-react';

export const FeaturePillars: React.FC = () => {
  const pillars = [
    {
      title: 'Prácticas Preprofesionales',
      description: 'Inducción guiada en video, evaluación de directrices y entrega de bitácoras oficiales según RRA.',
      icon: GraduationCap,
      code: 'RRA-PRAC-01',
    },
    {
      title: 'Vinculación Comunitaria',
      description: 'Gestión de proyectos con la sociedad, plantillas de evidencias y validación horaria ministerial.',
      icon: BookOpen,
      code: 'CES-VINC-02',
    },
    {
      title: 'Conferencias & Eventos',
      description: 'Acceso rápido vía QR a diapositivas, encuestas de satisfacción y certificados PDF verificables.',
      icon: Calendar,
      code: 'SEC-CERT-03',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {pillars.map((p) => {
        const Icon = p.icon;
        return (
          <div
            key={p.title}
            className="m365-card m365-card-hover p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="h-8 w-8 rounded-md bg-[#ebf3fc] text-[#0f6cbd] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[#616161] bg-[#f0f0f0] px-2 py-0.5 rounded-sm">
                  {p.code}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-[#242424] mb-1">{p.title}</h4>
              <p className="text-xs text-[#616161] leading-relaxed">{p.description}</p>
            </div>
            <div className="mt-3.5 pt-2.5 border-t border-[#edebe9] flex items-center justify-between text-[11px] text-[#0f6cbd] font-semibold">
              <span>Normativa vigente</span>
              <span>100% Digital</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
