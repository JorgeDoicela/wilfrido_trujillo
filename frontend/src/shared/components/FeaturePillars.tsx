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
            className="glass-card p-6 rounded-3xl flex flex-col gap-3 hover:border-white/35 transition-all shadow-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/25 border-t-white/50 flex items-center justify-center text-white mb-1 backdrop-blur-xl shadow-xs">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-sm font-semibold text-white tracking-tight">{p.title}</h4>
            <p className="text-xs text-[#C4C4C4] leading-relaxed">{p.description}</p>
          </div>
        );
      })}
    </div>
  );
};
