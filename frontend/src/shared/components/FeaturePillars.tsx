import React from 'react';
import { GraduationCap, BookOpen, Calendar } from 'lucide-react';

export const FeaturePillars: React.FC = () => {
  const pillars = [
    {
      title: 'Prácticas Preprofesionales',
      description: 'Inducción guiada en video, evaluación de directrices y entrega de bitácoras oficiales según RRA.',
      icon: GraduationCap,
    },
    {
      title: 'Vinculación Comunitaria',
      description: 'Gestión de proyectos con la sociedad, plantillas de evidencias y validación horaria ministerial.',
      icon: BookOpen,
    },
    {
      title: 'Conferencias & Eventos',
      description: 'Acceso rápido vía QR a diapositivas, encuestas de satisfacción y certificados PDF verificables.',
      icon: Calendar,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {pillars.map((p) => {
        const Icon = p.icon;
        return (
          <div
            key={p.title}
            className="m365-card p-4 flex flex-col gap-2"
          >
            <Icon className="w-4 h-4 text-[#0f6cbd]" />
            <h4 className="text-sm font-semibold text-[#242424]">{p.title}</h4>
            <p className="text-xs text-[#616161] leading-relaxed">{p.description}</p>
          </div>
        );
      })}
    </div>
  );
};
