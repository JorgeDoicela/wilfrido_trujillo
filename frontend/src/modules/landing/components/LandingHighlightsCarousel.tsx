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
  CheckCircle2,
  Clock,
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
      badge: '240 Horas Normativas · RRA CES',
      headline: 'Acreditación Rigurosa de 240 Horas de Práctica Laboral',
      description:
        'Supervisión de prácticas en empresas públicas y privadas bajo convenios formalizados, inducción audiovisual obligatoria con verificación biométrica y control de bitácoras.',
      cta: 'Verificar Espacio de Prácticas',
      visual: (
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-[#edebe9] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#107c10]" />
                <span className="text-xs font-semibold text-[#242424]">
                  Módulo de Inducción Audiovisual Obligatoria
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#616161] px-2 py-0.5 bg-[#f5f5f5] rounded border border-[#e0e0e0]">
                RRA-PPP-2026
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#616161]">Progreso de Sesiones de Inducción:</span>
                <span className="font-semibold text-[#107c10]">3 de 3 Módulos (100%)</span>
              </div>
              <div className="w-full bg-[#edebe9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#107c10] h-full rounded-full w-full transition-all duration-500" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded bg-[#f5f5f5] border border-[#edebe9]">
                  <span className="text-[10px] text-[#616161] uppercase tracking-wider block font-medium">
                    Horas Acreditadas
                  </span>
                  <span className="text-base font-bold text-[#242424]">240 / 240 h</span>
                </div>
                <div className="p-2.5 rounded bg-[#f5f5f5] border border-[#edebe9]">
                  <span className="text-[10px] text-[#616161] uppercase tracking-wider block font-medium">
                    Tutor Asignado
                  </span>
                  <span className="text-xs font-semibold text-[#242424] truncate block">
                    Ing. Wilfrido Trujillo
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#edebe9] flex items-center justify-between text-[11px]">
            <span className="text-[#616161] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#107c10]" />
              Aprobación de Tutor Académico y Empresarial
            </span>
            <span className="font-semibold text-[#0f6cbd]">Estado: Acreditado</span>
          </div>
        </div>
      ),
    },
    {
      id: 'vinculacion',
      icon: Building2,
      category: 'Vinculación con la Sociedad',
      badge: 'Extensión Universitaria & Territorio',
      headline: 'Impacto Social Directo y Transferencia Tecnológica',
      description:
        'Planificación y despliegue de proyectos comunitarios con control de beneficiarios, actas de entrega-recepción suscritas y registro de evidencias georreferenciadas en Chimborazo.',
      cta: 'Explorar Proyectos Comunitarios',
      visual: (
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-[#edebe9] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0f6cbd]" />
                <span className="text-xs font-semibold text-[#242424]">
                  Proyecto: Alfabetización Digital & Ciberseguridad
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#0f6cbd] px-2 py-0.5 bg-[#ebf3fc] rounded border border-[#cfe4fa]">
                VINC-2026-04
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 rounded bg-[#ebf3fc]/50 border border-[#cfe4fa]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#0f6cbd]">Población Beneficiaria</span>
                  <span className="font-bold text-[#242424]">145 Familias / Parroquia Calpi</span>
                </div>
                <p className="text-[11px] text-[#616161]">
                  Talleres de capacitación presencial sobre herramientas web y protección de identidad digital.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded bg-[#f5f5f5] border border-[#edebe9]">
                  <span className="text-[10px] text-[#616161] uppercase tracking-wider block font-medium">
                    Entregables Validados
                  </span>
                  <span className="text-base font-bold text-[#242424]">4 Manuales</span>
                </div>
                <div className="p-2.5 rounded bg-[#f5f5f5] border border-[#edebe9]">
                  <span className="text-[10px] text-[#616161] uppercase tracking-wider block font-medium">
                    Acta de Cierre
                  </span>
                  <span className="text-xs font-semibold text-[#107c10] truncate block">
                    Firma Electrónica OK
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#edebe9] flex items-center justify-between text-[11px]">
            <span className="text-[#616161] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#107c10]" />
              Conformidad Social y Evaluación Favorable
            </span>
            <span className="font-semibold text-[#0f6cbd]">Horas: 96 / 96 h</span>
          </div>
        </div>
      ),
    },
    {
      id: 'eventos',
      icon: Award,
      category: 'Eventos & Certificación',
      badge: 'Criptografía SHA-256 + Código QR',
      headline: 'Acreditación Magistral y Emisión Criptográfica',
      description:
        'Registro de asistencia con control estricto de aforo, generación de credenciales automáticas y emisión de diplomas auditables con hash único e inalterable.',
      cta: 'Verificar Certificados Oficiales',
      visual: (
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-[#edebe9] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#107c10]" />
                <span className="text-xs font-semibold text-[#242424]">
                  Simposio Nacional de Arquitectura de Software
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#107c10] px-2 py-0.5 bg-[#dff6dd] rounded border border-[#a3d9a5]">
                CERTIFICADO VÁLIDO
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 rounded bg-[#f5f5f5] border border-[#edebe9] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#616161]">Participante:</span>
                  <span className="font-semibold text-[#242424]">Estudiante / Profesional</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#616161]">Horas Acreditadas:</span>
                  <span className="font-semibold text-[#242424]">40 Horas Académicas</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#edebe9]">
                  <span className="text-[#616161]">Huella Criptográfica:</span>
                  <span className="font-mono text-[10px] text-[#0f6cbd] font-semibold truncate max-w-[180px]">
                    e3b0c44298fc1c149afbf4c8996fb924
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#eff6fc] rounded border border-[#9ec5fe] text-xs">
                <span className="text-[#0078d4] font-medium">Validación Instantánea:</span>
                <span className="font-semibold text-[#0078d4]">100% Auténtico</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#edebe9] flex items-center justify-between text-[11px]">
            <span className="text-[#616161] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#107c10]" />
              Emisión Oficial Firmada Digitalmente
            </span>
            <span className="font-semibold text-[#107c10]">Aprobado</span>
          </div>
        </div>
      ),
    },
    {
      id: 'auditor',
      icon: FileCheck2,
      category: 'Auditor Documental Heurístico',
      badge: 'Control Automático de Rúbrica RRA',
      headline: 'Auditoría Algorítmica de Informes Técnicos',
      description:
        'Análisis sintáctico y semántico previo al visado docente. Comprueba estructura de carátula, consistencia cronológica, evidencias obligatorias y cumplimiento del formato reglamentario.',
      cta: 'Conocer Reglas de Auditoría',
      visual: (
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-[#edebe9] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#107c10]" />
                <span className="text-xs font-semibold text-[#242424]">
                  Dictamen Heurístico de Pre-Calificación
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#0f6cbd] px-2 py-0.5 bg-[#ebf3fc] rounded border border-[#cfe4fa]">
                RRA-CHECK-V2
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-[#f5f5f5] border border-[#edebe9]">
                <span className="text-[#242424] font-medium">Carátula y Metadatos Institucionales</span>
                <span className="font-semibold text-[#107c10]">Conforme (10/10)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#f5f5f5] border border-[#edebe9]">
                <span className="text-[#242424] font-medium">Cronograma vs. Bitácoras de Asistencia</span>
                <span className="font-semibold text-[#107c10]">Coherente (240h)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#f5f5f5] border border-[#edebe9]">
                <span className="text-[#242424] font-medium">Matriz de Evidencias y Certificados</span>
                <span className="font-semibold text-[#107c10]">Completas</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#dff6dd] border border-[#a3d9a5]">
                <span className="text-[#107c10] font-semibold">Dictamen Final del Agente:</span>
                <span className="font-bold text-[#107c10]">APROBADO PARA FIRMA</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#edebe9] flex items-center justify-between text-[11px]">
            <span className="text-[#616161] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#107c10]" />
              Cero Devoluciones Injustificadas
            </span>
            <span className="font-semibold text-[#0f6cbd]">Tiempo: 1.2s</span>
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
  const IconComponent = activeSlide.icon;

  return (
    <section id="pilares" className="py-16 sm:py-24 bg-[#f5f5f5] border-t border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0f6cbd] block mb-1">
              Ecosistema Integral de Gestión
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#242424]">
              Pilares Fundamentales del Despacho Académico
            </h2>
          </div>

          {/* Controles de Reproducción y Navegación */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-md bg-white border border-[#e0e0e0] flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f0f0f0] transition-colors cursor-pointer shadow-2xs"
              title={isPlaying ? 'Pausar rotación automática' : 'Reanudar rotación automática'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={prevSlide}
              className="w-8 h-8 rounded-md bg-white border border-[#e0e0e0] flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f0f0f0] transition-colors cursor-pointer shadow-2xs"
              title="Pilar anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="w-8 h-8 rounded-md bg-white border border-[#e0e0e0] flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f0f0f0] transition-colors cursor-pointer shadow-2xs"
              title="Siguiente pilar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Indicadores de Progreso Superiores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {slides.map((s, idx) => {
            const isCurrent = idx === activeIndex;
            const TabIcon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`text-left p-3 rounded-lg border transition-all cursor-pointer relative overflow-hidden ${
                  isCurrent
                    ? 'bg-white border-[#0f6cbd] shadow-xs ring-1 ring-[#0f6cbd]'
                    : 'bg-white/60 border-[#e0e0e0] hover:bg-white hover:border-[#c7c7c7]'
                }`}
              >
                {/* Barra de progreso animada para el slide activo */}
                {isCurrent && (
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-[#ebf3fc] -z-0 transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-2">
                  <TabIcon
                    className={`w-4 h-4 shrink-0 ${
                      isCurrent ? 'text-[#0f6cbd]' : 'text-[#616161]'
                    }`}
                  />
                  <div className="truncate">
                    <span
                      className={`text-xs font-semibold block truncate ${
                        isCurrent ? 'text-[#0f6cbd]' : 'text-[#242424]'
                      }`}
                    >
                      {s.category}
                    </span>
                    <span className="text-[10px] text-[#616161] truncate block">
                      {idx + 1} de {totalSlides}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Contenedor Principal del Slide Activo */}
        <div className="m365-card p-6 sm:p-10 bg-white border border-[#e0e0e0] rounded-xl shadow-xs transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lado Izquierdo: Información y Acciones */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#ebf3fc] border border-[#cfe4fa] text-[#0f6cbd] text-xs font-semibold mb-4">
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{activeSlide.badge}</span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#242424] leading-snug mb-3">
                  {activeSlide.headline}
                </h3>

                <p className="text-sm text-[#616161] leading-relaxed mb-6">
                  {activeSlide.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#edebe9] flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onEnterPortal}
                  className="px-4 py-2.5 rounded-md bg-[#0f6cbd] text-white font-semibold text-xs hover:bg-[#115ea3] active:bg-[#0c3b5e] transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span>{activeSlide.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-xs text-[#616161] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#a19f9d]" />
                  Acreditación auditada bajo RRA 2026
                </span>
              </div>
            </div>

            {/* Lado Derecho: Visual Mockup Interactivo del Pilar */}
            <div className="lg:col-span-6 min-h-[300px]">
              {activeSlide.visual}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
