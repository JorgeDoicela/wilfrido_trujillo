import React from 'react';
import { GraduationCap, BookOpen, Calendar } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';

export const FeaturePillars: React.FC = () => {
  const pillars = [
    {
      title: 'Prácticas Preprofesionales',
      description: 'Inducción obligatoria guiada, evaluación de directrices y entrega de bitácoras oficiales.',
      icon: GraduationCap,
      color: 'blue',
      borderColor: 'group-hover:border-blue-500/40',
      iconBox: 'bg-blue-600/10 border-blue-500/20 text-blue-400',
    },
    {
      title: 'Vinculación Comunitaria',
      description: 'Gestión de proyectos con la sociedad, plantillas de evidencias y validación de horas.',
      icon: BookOpen,
      color: 'purple',
      borderColor: 'group-hover:border-purple-500/40',
      iconBox: 'bg-purple-600/10 border-purple-500/20 text-purple-400',
    },
    {
      title: 'Conferencias & Eventos',
      description: 'Acceso rápido vía QR a diapositivas, encuestas de satisfacción y certificados PDF verificables.',
      icon: Calendar,
      color: 'emerald',
      borderColor: 'group-hover:border-emerald-500/40',
      iconBox: 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
      {pillars.map((p) => {
        const Icon = p.icon;
        return (
          <Card
            key={p.title}
            className={`p-6 transition-all duration-300 group hover:border-slate-700 cursor-default ${p.borderColor}`}
          >
            <div
              className={`h-12 w-12 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform ${p.iconBox}`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{p.description}</p>
          </Card>
        );
      })}
    </div>
  );
};
