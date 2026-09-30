import React from 'react';
import { GraduationCap, BookOpen, Calendar } from 'lucide-react';

export const FeaturePillars: React.FC = () => {
  const pillars = [
    {
      title: 'Prácticas Preprofesionales',
      description: 'Inducción obligatoria guiada, evaluación de directrices y entrega de bitácoras oficiales según RRA.',
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
            className="bg-white border border-[#d1d5db]/80 rounded-[4px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#1b2a4a]/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-8 w-8 rounded-[2px] bg-[#f0f4f8] text-[#1b2a4a] border border-[#d1d5db] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[#605e5c] bg-[#faf9f8] px-2 py-0.5 border border-[#e5e7eb] rounded-[2px]">
                  {p.code}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">{p.title}</h3>
              <p className="text-xs text-[#605e5c] leading-relaxed">{p.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex items-center justify-between text-[11px] text-[#0078d4] font-semibold">
              <span>Normativa vigente</span>
              <span>100% Digital</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
