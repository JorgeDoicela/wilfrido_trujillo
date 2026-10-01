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
        <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-white text-[#242424] font-sans select-none text-left">
          <div className="flex flex-col gap-1 mb-4">
            <h4 className="text-base sm:text-lg font-semibold tracking-tight text-[#242424]">
              Panel Estudiantil Soberano
            </h4>
            <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
              Autogestión completa del expediente de prácticas y vinculación.
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#e0e0e0] pt-4 border-t border-[#edebe9] my-auto">
            <div className="flex flex-col gap-1 pr-4">
              <span className="text-xs font-semibold text-[#242424]">
                Inducción
              </span>
              <p className="text-xs text-[#616161] leading-relaxed">
                Visualización certificada sin saltos de cápsulas oficiales.
              </p>
            </div>

            <div className="flex flex-col gap-1 px-4">
              <span className="text-xs font-semibold text-[#242424]">
                Bitácoras
              </span>
              <p className="text-xs text-[#616161] leading-relaxed">
                Cómputo progresivo de hasta 240 horas laborales.
              </p>
            </div>

            <div className="flex flex-col gap-1 pl-4">
              <span className="text-xs font-semibold text-[#242424]">
                Pre-Dictamen
              </span>
              <p className="text-xs text-[#616161] leading-relaxed">
                Validación heurística de informes antes del visado definitivo.
              </p>
            </div>
          </div>

          <div className="text-xs text-[#616161] pt-4 border-t border-[#edebe9]">
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
        <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-white text-[#242424] font-sans select-none text-left">
          <div className="flex flex-col gap-1 mb-4">
            <h4 className="text-base sm:text-lg font-semibold tracking-tight text-[#242424]">
              Despacho de Tutoría y Calificación
            </h4>
            <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
              Herramientas de evaluación objetiva conforme al Régimen Académico.
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#e0e0e0] pt-4 border-t border-[#edebe9] my-auto">
            <div className="flex flex-col gap-1 pr-4">
              <span className="text-xs font-semibold text-[#242424]">
                Matriz de Cohorte
              </span>
              <p className="text-xs text-[#616161] leading-relaxed">
                Supervisión en tiempo real de todos los practicantes asignados.
              </p>
            </div>

            <div className="flex flex-col gap-1 px-4">
              <span className="text-xs font-semibold text-[#242424]">
                Rúbricas RRA
              </span>
              <p className="text-xs text-[#616161] leading-relaxed">
                Evaluación ponderada por criterios normativos obligatorios.
              </p>
            </div>

            <div className="flex flex-col gap-1 pl-4">
              <span className="text-xs font-semibold text-[#242424]">
                Actas Oficiales
              </span>
              <p className="text-xs text-[#616161] leading-relaxed">
                Generación y legalización de informes consolidados finales.
              </p>
            </div>
          </div>

          <div className="text-xs text-[#616161] pt-4 border-t border-[#edebe9]">
            Aprobación ágil de expedientes y retroalimentación técnica.
          </div>
        </div>
      ),
    },
    {
      id: 'empresas',
      navTitle: 'Para Entidades Colaboradoras',
      title: 'Convenios y Control de Desempeño Laboral',
      description:
        'Homologación de cartas de compromiso, designación formal del tutor empresarial, control de presencialidad y firma de finiquito.',
      renderScreen: () => (
        <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-white text-[#242424] font-sans select-none text-left">
          <div className="flex flex-col gap-1 mb-4">
            <h4 className="text-base sm:text-lg font-semibold tracking-tight text-[#242424]">
              Gestión de Convenios y Entidades
            </h4>
            <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
              Articulación directa con el sector productivo e institucional.
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#e0e0e0] pt-4 border-t border-[#edebe9] my-auto">
            <div className="flex flex-col gap-1 pr-4">
              <span className="text-xs font-semibold text-[#242424]">
                Convenios Marco
              </span>
              <p className="text-xs text-[#616161] leading-relaxed">
                Registro y validación de acuerdos interinstitucionales.
              </p>
            </div>

            <div className="flex flex-col gap-1 px-4">
              <span className="text-xs font-semibold text-[#242424]">
                Asistencia in Situ
              </span>
              <p className="text-xs text-[#616161] leading-relaxed">
                Control semanal de asistencia y puntualidad en sede.
              </p>
            </div>

            <div className="flex flex-col gap-1 pl-4">
              <span className="text-xs font-semibold text-[#242424]">
                Certificado Final
              </span>
              <p className="text-xs text-[#616161] leading-relaxed">
                Constancia empresarial con validez oficial.
              </p>
            </div>
          </div>

          <div className="text-xs text-[#616161] pt-4 border-t border-[#edebe9]">
            Evaluación técnica de competencias en el entorno real de trabajo.
          </div>
        </div>
      ),
    },
    {
      id: 'auditoria',
      navTitle: 'Para Validación Pública',
      title: 'Transparencia Criptográfica SHA-256',
      description:
        'Comprobación abierta de autenticidad e inmutabilidad de certificados mediante código QR o hash sin requerir credenciales de acceso.',
      renderScreen: () => (
        <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-white text-[#242424] font-sans select-none text-left">
          <div className="flex flex-col gap-1 mb-4">
            <h4 className="text-base sm:text-lg font-semibold tracking-tight text-[#242424]">
              Validador Criptográfico Soberano
            </h4>
            <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
              Consulta pública sin intermediarios bajo integridad SHA-256.
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#e0e0e0] pt-4 border-t border-[#edebe9] my-auto">
            <div className="flex flex-col gap-1 pr-4">
              <span className="text-xs font-semibold text-[#242424]">
                Hash SHA-256
              </span>
              <p className="text-xs text-[#616161] leading-relaxed">
                Huella inalterable calculada al momento de la expedición.
              </p>
            </div>

            <div className="flex flex-col gap-1 px-4">
              <span className="text-xs font-semibold text-[#242424]">
                Código QR
              </span>
              <p className="text-xs text-[#616161] leading-relaxed">
                Escaneo inmediato desde cualquier teléfono o lector óptico.
              </p>
            </div>

            <div className="flex flex-col gap-1 pl-4">
              <span className="text-xs font-semibold text-[#242424]">
                Auditor RRA
              </span>
              <p className="text-xs text-[#616161] leading-relaxed">
                Comprobación de fechas, tutor y periodo académico.
              </p>
            </div>
          </div>

          <div className="text-xs text-[#616161] pt-4 border-t border-[#edebe9]">
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
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#242424]">
          Conoce a fondo el ecosistema.
        </h2>
      </div>

      {/* Tarjeta Contenedora Principal */}
      <div className="w-full rounded-2xl md:rounded-3xl bg-white border border-[#e0e0e0] p-6 sm:p-10 md:p-12 shadow-xs relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Columna Izquierda: Botones de Navegación y Detalle */}
          <div className="lg:col-span-5 flex items-start gap-3">
            <div className="flex flex-col gap-1.5 shrink-0 pt-1">
              <button
                type="button"
                onClick={handlePrev}
                className="w-7 h-7 rounded-full border border-[#d1d1d1] bg-white flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                aria-label="Anterior"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 rounded-full border border-[#d1d1d1] bg-white flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
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
                      className="rounded-xl border border-[#0f6cbd] p-4 flex flex-col gap-2 shadow-2xs"
                    >
                      <p className="text-xs sm:text-sm text-[#242424] leading-relaxed">
                        <span className="font-semibold">{item.title}. </span>
                        <span className="text-[#616161]">{item.description}</span>
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
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium border border-[#d1d1d1] bg-white text-[#242424] hover:bg-[#f5f5f5] text-left w-fit cursor-pointer transition-colors"
                  >
                    <div className="w-4 h-4 rounded-full border border-[#616161] flex items-center justify-center shrink-0">
                      <Plus className="w-2.5 h-2.5 text-[#616161]" />
                    </div>
                    <span>{item.navTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Pantalla de la Característica Activa */}
          <div className="lg:col-span-7 w-full flex items-center justify-center">
            <div className="w-full rounded-xl border border-[#e0e0e0] shadow-xs overflow-hidden min-h-[300px] flex items-center justify-center">
              {details[activeItem].renderScreen()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
