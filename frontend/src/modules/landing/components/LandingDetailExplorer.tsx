import React, { useState } from 'react';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';

export const LandingDetailExplorer: React.FC = () => {
  const [activeItem, setActiveItem] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const details = [
    {
      id: 'estudiantes',
      navTitle: 'Para Estudiantes',
      title: 'Acreditación y Seguimiento para Estudiantes',
      description:
        'Entorno de trabajo para enrolarse mediante código de espacio, cursar la inducción obligatoria, registrar bitácoras diarias y verificar el informe final.',
      renderScreen: () => (
        <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-white/[0.04] backdrop-blur-2xl text-[#F0F0F3] font-sans select-none text-left rounded-xl">
          <div className="flex flex-col gap-1 mb-4">
            <h4 className="text-base sm:text-lg font-semibold tracking-tight text-white">
              Panel Estudiantil Soberano
            </h4>
            <p className="text-xs sm:text-sm text-[#C4C4C4] leading-relaxed">
              Autogestión completa del expediente de prácticas y vinculación.
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/10 pt-4 border-t border-white/10 my-auto">
            <div className="flex flex-col gap-1 pr-4">
              <span className="text-xs font-semibold text-white">
                Inducción
              </span>
              <p className="text-xs text-[#C4C4C4] leading-relaxed">
                Visualización certificada sin saltos de cápsulas oficiales.
              </p>
            </div>

            <div className="flex flex-col gap-1 px-4">
              <span className="text-xs font-semibold text-white">
                Bitácoras
              </span>
              <p className="text-xs text-[#C4C4C4] leading-relaxed">
                Cómputo progresivo de hasta 240 horas laborales.
              </p>
            </div>

            <div className="flex flex-col gap-1 pl-4">
              <span className="text-xs font-semibold text-white">
                Pre-Dictamen
              </span>
              <p className="text-xs text-[#C4C4C4] leading-relaxed">
                Validación heurística de informes antes del visado definitivo.
              </p>
            </div>
          </div>

          <div className="text-xs text-[#C4C4C4] pt-4 border-t border-white/10">
            Acceso directo mediante código de asignatura o periodo lectivo.
          </div>
        </div>
      ),
    },
    {
      id: 'docentes',
      navTitle: 'Para Docentes Tutores',
      title: 'Supervisión Centralizada y Matriz RRA',
      description:
        'Control integral de cohortes, aprobación ágil de bitácoras, rúbricas de calificación ponderadas y generación soberana de actas definitivas.',
      renderScreen: () => (
        <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-white/[0.04] backdrop-blur-2xl text-[#F0F0F3] font-sans select-none text-left rounded-xl">
          <div className="flex flex-col gap-1 mb-4">
            <h4 className="text-base sm:text-lg font-semibold tracking-tight text-white">
              Despacho de Tutoría y Calificación
            </h4>
            <p className="text-xs sm:text-sm text-[#C4C4C4] leading-relaxed">
              Herramientas de evaluación objetiva conforme al Régimen Académico.
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/10 pt-4 border-t border-white/10 my-auto">
            <div className="flex flex-col gap-1 pr-4">
              <span className="text-xs font-semibold text-white">
                Matriz de Cohorte
              </span>
              <p className="text-xs text-[#C4C4C4] leading-relaxed">
                Supervisión en tiempo real de todos los practicantes asignados.
              </p>
            </div>

            <div className="flex flex-col gap-1 px-4">
              <span className="text-xs font-semibold text-white">
                Rúbricas RRA
              </span>
              <p className="text-xs text-[#C4C4C4] leading-relaxed">
                Evaluación ponderada por criterios normativos obligatorios.
              </p>
            </div>

            <div className="flex flex-col gap-1 pl-4">
              <span className="text-xs font-semibold text-white">
                Actas Oficiales
              </span>
              <p className="text-xs text-[#C4C4C4] leading-relaxed">
                Descarga de expedientes consolidados para el archivo institucional.
              </p>
            </div>
          </div>

          <div className="text-xs text-[#C4C4C4] pt-4 border-t border-white/10">
            Visado electrónico y control estricto de fechas de entrega.
          </div>
        </div>
      ),
    },
    {
      id: 'certificados',
      navTitle: 'Acreditación y QR',
      title: 'Certificados Oficiales con Verificación QR',
      description:
        'Emisión automatizada de diplomas y constancias de participación con verificación institucional mediante código QR.',
      renderScreen: () => (
        <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-white/[0.04] backdrop-blur-2xl text-[#F0F0F3] font-sans select-none text-left rounded-xl">
          <div className="flex flex-col gap-1 mb-4">
            <h4 className="text-base sm:text-lg font-semibold tracking-tight text-white">
              Verificación Digital Institucional
            </h4>
            <p className="text-xs sm:text-sm text-[#C4C4C4] leading-relaxed">
              Autenticidad comprobable en tiempo real mediante registro institucional oficial.
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/10 pt-4 border-t border-white/10 my-auto">
            <div className="flex flex-col gap-1 pr-4">
              <span className="text-xs font-semibold text-white">
                Código Único
              </span>
              <p className="text-xs text-[#C4C4C4] leading-relaxed">
                Identificador oficial asignado a cada constancia emitida.
              </p>
            </div>

            <div className="flex flex-col gap-1 px-4">
              <span className="text-xs font-semibold text-white">
                Código QR
              </span>
              <p className="text-xs text-[#C4C4C4] leading-relaxed">
                Escaneo inmediato desde cualquier teléfono o lector óptico.
              </p>
            </div>

            <div className="flex flex-col gap-1 pl-4">
              <span className="text-xs font-semibold text-white">
                Auditor RRA
              </span>
              <p className="text-xs text-[#C4C4C4] leading-relaxed">
                Comprobación de fechas, tutor y periodo académico.
              </p>
            </div>
          </div>

          <div className="text-xs text-[#C4C4C4] pt-4 border-t border-white/10">
            Garantía de inmutabilidad y certeza legal ante organismos de control.
          </div>
        </div>
      ),
    },
  ];

  const totalItems = details.length;

  const handlePrev = () => {
    setActiveItem((prev) => (prev - 1 + totalItems) % totalItems);
    setIsExpanded(true);
  };

  const handleNext = () => {
    setActiveItem((prev) => (prev + 1) % totalItems);
    setIsExpanded(true);
  };

  return (
    <section className="w-full flex flex-col gap-6 py-8">
      {/* Título de Sección */}
      <div className="w-full mb-2">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
          Conoce a fondo el ecosistema.
        </h2>
      </div>

      {/* Tarjeta Contenedora Principal en Glassmorphism */}
      <div className="w-full rounded-2xl md:rounded-3xl glass-card p-6 sm:p-10 md:p-12 shadow-2xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Columna Izquierda: Botones de Navegación y Detalle */}
          <div className="lg:col-span-5 flex items-start gap-3">
            <div className="flex flex-col gap-1.5 shrink-0 pt-1">
              <button
                type="button"
                onClick={handlePrev}
                className="w-7 h-7 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-[#C4C4C4] hover:text-white hover:bg-white/20 transition-all backdrop-blur-md cursor-pointer"
                aria-label="Anterior"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-[#C4C4C4] hover:text-white hover:bg-white/20 transition-all backdrop-blur-md cursor-pointer"
                aria-label="Siguiente"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              {details.map((item, idx) => {
                const isActive = isExpanded && idx === activeItem;

                if (isActive) {
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/35 border-t-white/60 bg-gradient-to-br from-white/20 to-white/10 p-5 flex flex-col gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.5)] backdrop-blur-xl"
                    >
                      <p className="text-xs sm:text-sm text-white leading-relaxed">
                        <span className="font-semibold text-white">{item.title}. </span>
                        <span className="text-[#C4C4C4]">{item.description}</span>
                      </p>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveItem(idx);
                      setIsExpanded(true);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#F0F0F3] hover:text-white hover:bg-white/[0.08] text-left w-fit cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-white/80 shrink-0" />
                    <span>{item.navTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Pantalla de la Característica Activa */}
          <div className="lg:col-span-7 w-full flex items-center justify-center">
            <div className="w-full rounded-2xl border border-white/15 shadow-sm overflow-hidden min-h-[300px] flex items-center justify-center bg-white/[0.02]">
              {details[activeItem].renderScreen()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
