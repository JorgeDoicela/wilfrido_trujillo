import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building2,
  Award,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';

export interface LandingHighlightsCarouselProps {
  onEnterPortal: () => void;
}

export const LandingHighlightsCarousel: React.FC<LandingHighlightsCarouselProps> = ({
  onEnterPortal,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const SLIDE_DURATION = 6500;
  const UPDATE_INTERVAL = 50;

  const slides = [
    {
      id: 'ppp',
      icon: GraduationCap,
      category: 'Prácticas Preprofesionales',
      headline: 'Acreditación de 240 Horas de Práctica Laboral',
      description:
        'Supervisión de prácticas en entidades receptoras con convenio vigente, inducción audiovisual obligatoria, registro diario de actividades y control de asistencia semanal.',
      cta: 'Verificar Espacio de Prácticas',
      visual: (
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-[#edebe9] pb-3 mb-4">
              <span className="text-xs font-semibold text-[#242424]">
                Módulo de Inducción Audiovisual
              </span>
              <span className="text-xs font-mono text-[#616161]">
                RRA-PPP-2026
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#616161]">Progreso de Sesiones:</span>
                <span className="font-semibold text-[#242424]">3 de 3 Módulos (100%)</span>
              </div>
              <div className="w-full bg-[#edebe9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#0f6cbd] h-full rounded-full w-full" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded border border-[#e0e0e0]">
                  <span className="text-xs text-[#616161] block">Horas Acreditadas</span>
                  <span className="text-sm font-bold text-[#242424]">240 / 240 h</span>
                </div>
                <div className="p-3 rounded border border-[#e0e0e0]">
                  <span className="text-xs text-[#616161] block">Tutor Responsable</span>
                  <span className="text-xs font-semibold text-[#242424] truncate block">
                    Ing. Wilfrido Trujillo
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#edebe9] flex items-center justify-between text-xs">
            <span className="text-[#616161]">Revisión de Tutor Académico</span>
            <span className="font-semibold text-[#0f6cbd]">Estado: Acreditado</span>
          </div>
        </div>
      ),
    },
    {
      id: 'vinculacion',
      icon: Building2,
      category: 'Vinculación con la Sociedad',
      headline: 'Proyectos de Impacto Social y Extensión',
      description:
        'Planificación y desarrollo de programas comunitarios con registro de beneficiarios directos, actas de entrega-recepción formalizadas y bitácoras técnicas de campo.',
      cta: 'Consultar Proyectos Activos',
      visual: (
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-[#edebe9] pb-3 mb-4">
              <span className="text-xs font-semibold text-[#242424]">
                Alfabetización Digital & Seguridad Informática
              </span>
              <span className="text-xs font-mono text-[#616161]">
                VINC-2026-04
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded border border-[#e0e0e0]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#242424]">Comunidad Beneficiaria</span>
                  <span className="text-xs font-bold text-[#242424]">145 Familias</span>
                </div>
                <p className="text-xs text-[#616161]">
                  Capacitación presencial sobre herramientas informáticas y protección de datos.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded border border-[#e0e0e0]">
                  <span className="text-xs text-[#616161] block">Entregables</span>
                  <span className="text-sm font-bold text-[#242424]">4 Manuales</span>
                </div>
                <div className="p-3 rounded border border-[#e0e0e0]">
                  <span className="text-xs text-[#616161] block">Acta Final</span>
                  <span className="text-xs font-semibold text-[#242424] truncate block">
                    Suscrita
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#edebe9] flex items-center justify-between text-xs">
            <span className="text-[#616161]">Evaluación Comunitaria</span>
            <span className="font-semibold text-[#0f6cbd]">96 Horas Cumplidas</span>
          </div>
        </div>
      ),
    },
    {
      id: 'eventos',
      icon: Award,
      category: 'Eventos & Certificación',
      headline: 'Acreditación y Emisión de Certificados',
      description:
        'Registro de asistencia con verificación de participación, expedición de credenciales y generación de diplomas protegidos mediante huella criptográfica SHA-256.',
      cta: 'Verificar Certificados Oficiales',
      visual: (
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-[#edebe9] pb-3 mb-4">
              <span className="text-xs font-semibold text-[#242424]">
                Simposio de Arquitectura de Software
              </span>
              <span className="text-xs font-mono text-[#616161]">
                Acreditado
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded border border-[#e0e0e0] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#616161]">Participación Registrada:</span>
                  <span className="font-semibold text-[#242424]">40 Horas Académicas</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#edebe9]">
                  <span className="text-[#616161]">Huella Criptográfica:</span>
                  <span className="font-mono text-xs text-[#242424] truncate max-w-[180px]">
                    e3b0c44298fc1c149afbf4c8996fb924
                  </span>
                </div>
              </div>

              <div className="p-3 border border-[#e0e0e0] rounded flex items-center justify-between text-xs">
                <span className="text-[#616161]">Autenticidad:</span>
                <span className="font-semibold text-[#0f6cbd]">Verificada</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#edebe9] flex items-center justify-between text-xs">
            <span className="text-[#616161]">Firma de Coordinación</span>
            <span className="font-semibold text-[#242424]">Registrado</span>
          </div>
        </div>
      ),
    },
    {
      id: 'auditor',
      icon: FileCheck2,
      category: 'Auditor Documental Heurístico',
      headline: 'Auditoría Estructural de Informes Técnicos',
      description:
        'Análisis sintáctico y de estructura previo a la revisión del docente. Valida carátula, coherencia cronológica, evidencias requeridas y cumplimiento de formatos reglamentarios.',
      cta: 'Ver Requisitos de Informes',
      visual: (
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-[#edebe9] pb-3 mb-4">
              <span className="text-xs font-semibold text-[#242424]">
                Revisión Estructural de Informe
              </span>
              <span className="text-xs font-mono text-[#616161]">
                RRA-CHECK
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded border border-[#e0e0e0]">
                <span className="text-[#242424]">Estructura de Carátula</span>
                <span className="font-semibold text-[#242424]">Conforme</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded border border-[#e0e0e0]">
                <span className="text-[#242424]">Cronograma de Bitácoras</span>
                <span className="font-semibold text-[#242424]">240 Horas</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded border border-[#e0e0e0]">
                <span className="text-[#242424]">Anexos y Certificados</span>
                <span className="font-semibold text-[#242424]">Completos</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#edebe9] flex items-center justify-between text-xs">
            <span className="text-[#616161]">Dictamen Heurístico</span>
            <span className="font-semibold text-[#0f6cbd]">Aprobado para Visado</span>
          </div>
        </div>
      ),
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  const goToSlide = (idx: number) => {
    setActiveIndex(idx);
    setProgress(0);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (UPDATE_INTERVAL / SLIDE_DURATION) * 100;
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  const activeSlide = slides[activeIndex];

  return (
    <section id="pilares" className="py-14 sm:py-20 bg-[#f5f5f5] border-t border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de Sección Sobria */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#616161] block mb-1">
              Áreas de Gestión
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#242424]">
              Pilares del Despacho de Coordinación
            </h2>
          </div>

          {/* Controles de Reproducción y Avance */}
          <div className="flex items-center gap-1.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded bg-white border border-[#d1d1d1] flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
              title={isPlaying ? 'Pausar' : 'Reanudar'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={prevSlide}
              className="w-8 h-8 rounded bg-white border border-[#d1d1d1] flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="w-8 h-8 rounded bg-white border border-[#d1d1d1] flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Indicadores Superiores Limpios */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {slides.map((s, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`text-left p-3 rounded border transition-all cursor-pointer relative overflow-hidden ${
                  isCurrent
                    ? 'bg-white border-[#0f6cbd] shadow-xs'
                    : 'bg-white border-[#e0e0e0] hover:border-[#c7c7c7]'
                }`}
              >
                {isCurrent && (
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-[#0f6cbd]/10 -z-0 transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                )}

                <div className="relative z-10">
                  <span
                    className={`text-xs font-semibold block truncate ${
                      isCurrent ? 'text-[#0f6cbd]' : 'text-[#242424]'
                    }`}
                  >
                    {s.category}
                  </span>
                  <span className="text-[10px] text-[#616161] block mt-0.5">
                    Módulo {idx + 1} de {totalSlides}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Contenedor del Slide */}
        <div className="bg-white border border-[#e0e0e0] rounded-lg p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lado Izquierdo: Descripción */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#0f6cbd] block mb-2">
                  {activeSlide.category}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#242424] mb-3">
                  {activeSlide.headline}
                </h3>

                <p className="text-sm text-[#616161] leading-relaxed mb-6">
                  {activeSlide.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#edebe9]">
                <button
                  type="button"
                  onClick={onEnterPortal}
                  className="px-4 py-2 rounded bg-[#0f6cbd] text-white font-semibold text-xs hover:bg-[#115ea3] active:bg-[#0c3b5e] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>{activeSlide.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Lado Derecho: Maqueta Limpia */}
            <div className="lg:col-span-6">
              {activeSlide.visual}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
