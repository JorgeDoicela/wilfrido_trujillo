import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import type { Workspace } from '@/shared/types/workspace.types';

export interface LandingBentoHubProps {
  workspaces?: Workspace[];
  onEnterPortal: () => void;
  onSelectWorkspace?: (workspace: Workspace) => void;
  onVerifyCertificate: (hash: string) => void;
}

export const LandingBentoHub: React.FC<LandingBentoHubProps> = ({
  workspaces = [],
  onEnterPortal,
  onSelectWorkspace,
  onVerifyCertificate,
}) => {
  const [certInput, setCertInput] = useState('');

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = certInput.trim();
    if (query) {
      onVerifyCertificate(query);
    } else {
      onVerifyCertificate('WT-2026-CERT-01');
    }
  };

  const handleGoToModule = (type: 'PRACTICAS' | 'VINCULACION' | 'EVENTO') => {
    const ws = workspaces.find((w) => w.type === type);
    if (ws && onSelectWorkspace) {
      onSelectWorkspace(ws);
    } else {
      onEnterPortal();
    }
  };

  return (
    <section className="w-full flex flex-col items-center text-center">
      {/* 1. Encabezado Proporcionado con Tipografía Pura (Cero Cápsulas o Cercos) */}
      <div className="mb-8 md:mb-10 max-w-3xl">
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-white/70 uppercase font-sans mb-3 select-none">
          Instituto Superior Tecnológico · Periodo 2026-I
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-3 drop-shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
          Wilfrido Trujillo
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#F0F0F3]/85 font-normal leading-relaxed max-w-2xl mx-auto">
          Plataforma de supervisión académica de prácticas laborales, vinculación comunitaria y certificación oficial con verificación QR.
        </p>
      </div>

      {/* 2. Rejilla Bento de Cristal Puro (4 Módulos Operativos Reales) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-left">
        {/* Tarjeta 1 (Principal - 2 Columnas): Prácticas Preprofesionales */}
        <div className="md:col-span-2 relative rounded-2xl md:rounded-3xl bg-gradient-to-b from-white/[0.09] via-white/[0.04] to-white/[0.02] border border-white/15 border-t-white/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.28)] hover:border-white/25 hover:border-t-white/60 hover:bg-white/[0.11] transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                Régimen Académico RRA Art. 54
              </span>
              <span className="text-xs font-mono text-white/60">
                240 Horas Normativas
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
              Prácticas Preprofesionales
            </h2>
            <p className="text-xs sm:text-sm text-[#C4C4C4] leading-relaxed max-w-xl mb-6">
              Supervisión de actividades formativas, inducción reglamentaria audiovisual, registro semanal de bitácoras laborales y auditoría documental de informes técnicos.
            </p>

            {/* Métrica Fáctica de Progreso */}
            <div className="w-full mb-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white mb-2">
                <span className="text-[#C4C4C4]">Cómputo Reglamentario de Horas</span>
                <span className="font-mono font-medium">240 / 240 h</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-white via-white/90 to-white/70 rounded-full w-full shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-white/70">
              Auditoría heurística y control de cumplimiento institucional.
            </span>
            <button
              type="button"
              onClick={() => handleGoToModule('PRACTICAS')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/25 border-t-white/50 backdrop-blur-md shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <span>Ingresar a Prácticas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tarjeta 2 (1 Columna): Vinculación con la Sociedad */}
        <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-b from-white/[0.09] via-white/[0.04] to-white/[0.02] border border-white/15 border-t-white/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.28)] hover:border-white/25 hover:border-t-white/60 hover:bg-white/[0.11] transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                Impacto Territorial
              </span>
              <span className="text-xs font-mono text-white/60">
                Convenios
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-2">
              Vinculación
            </h2>
            <p className="text-xs text-[#C4C4C4] leading-relaxed mb-6">
              Gestión de proyectos comunitarios, ejecución de acuerdos interinstitucionales y supervisión docente en territorio.
            </p>

            <div className="space-y-2 py-3 border-t border-b border-white/10 text-xs text-white/80">
              <div className="flex justify-between">
                <span className="text-[#C4C4C4]">Supervisión Docente</span>
                <span className="font-semibold text-white">Activa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#C4C4C4]">Acreditación</span>
                <span className="font-semibold text-white">Certificada</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={() => handleGoToModule('VINCULACION')}
              className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/25 border-t-white/50 backdrop-blur-md shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <span>Ver Proyectos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tarjeta 3 (1 Columna): Validador QR y Certificación Oficial */}
        <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-b from-white/[0.09] via-white/[0.04] to-white/[0.02] border border-white/15 border-t-white/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.28)] hover:border-white/25 hover:border-t-white/60 hover:bg-white/[0.11] transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                Verificación Oficial
              </span>
              <span className="text-xs font-mono text-emerald-400">
                En Línea
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-2">
              Validar Certificado
            </h2>
            <p className="text-xs text-[#C4C4C4] leading-relaxed mb-5">
              Consulta pública de autenticidad institucional mediante código o identificador de constancia.
            </p>

            {/* Formulario de Consulta Rápida de Cristal */}
            <form onSubmit={handleVerifySubmit} className="flex flex-col gap-2.5">
              <div className="relative">
                <input
                  type="text"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  placeholder="Código institucional..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.08] border border-white/20 focus:border-white/50 focus:bg-white/[0.14] text-xs text-white placeholder-white/40 outline-none backdrop-blur-md transition-all font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold border border-white/30 border-t-white/60 backdrop-blur-md shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Consultar Acreditación</span>
              </button>
            </form>
          </div>

          <p className="text-[11px] text-[#C4C4C4] pt-4 mt-2 border-t border-white/10">
            Firma electrónica y respaldo en base de datos institucional.
          </p>
        </div>

        {/* Tarjeta 4 (2 Columnas): Consola de Acreditación y Conferencias */}
        <div className="md:col-span-2 relative rounded-2xl md:rounded-3xl bg-gradient-to-b from-white/[0.09] via-white/[0.04] to-white/[0.02] border border-white/15 border-t-white/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.28)] hover:border-white/25 hover:border-t-white/60 hover:bg-white/[0.11] transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                Consola Académica Integral
              </span>
              <span className="text-xs font-mono text-white/60">
                PBAC Multi-Rol
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
              Gestión de Eventos y Evaluación Docente
            </h2>
            <p className="text-xs sm:text-sm text-[#C4C4C4] leading-relaxed max-w-xl mb-6">
              Plataforma para docentes evaluadores y estudiantes: aplicación de cuestionarios diagnósticos, control de asistencia a seminarios y emisión de constancias académicas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => handleGoToModule('EVENTO')}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/30 text-left transition-all cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-white">Eventos & Seminarios</div>
                  <div className="text-[11px] text-[#C4C4C4]">Asistencia y acreditación</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-white/70" />
              </button>

              <button
                type="button"
                onClick={onEnterPortal}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/30 text-left transition-all cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-white">Cuestionarios & Inducción</div>
                  <div className="text-[11px] text-[#C4C4C4]">Evaluaciones normativas</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-white/70" />
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10">
            <span className="text-xs text-white/70">
              Espacio oficial para la carrera y tutorías académicas.
            </span>
            <button
              type="button"
              onClick={onEnterPortal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-semibold border border-white/30 border-t-white/60 backdrop-blur-md shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <span>Acceder al Portal Completo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingBentoHub;
