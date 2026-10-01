import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export interface LandingHighlightsCarouselProps {
  onEnterPortal: () => void;
}

export const LandingHighlightsCarousel: React.FC<LandingHighlightsCarouselProps> = ({
  onEnterPortal,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  const SLIDE_DURATION = 6500;

  const slides = [
    {
      id: 'ppp',
      headline: 'Prácticas Preprofesionales',
      description:
        'Supervisión y acreditación de 240 horas laborales en empresas e instituciones bajo convenios formalizados.',
      linkText: 'Ingresar al módulo de prácticas',
      renderVisual: () => (
        <div className="w-full flex flex-col justify-center text-left py-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-0 sm:divide-x divide-[#e0e0e0]">
            <div className="flex flex-col gap-1 sm:gap-2 sm:pr-6">
              <span className="text-xs sm:text-base font-semibold text-[#242424]">
                Inducción Audiovisual
              </span>
              <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
                Cápsulas formativas sobre deberes reglamentarios y normativas del Régimen Académico.
              </p>
            </div>

            <div className="flex flex-col gap-1 sm:gap-2 sm:px-6">
              <span className="text-xs sm:text-base font-semibold text-[#242424]">
                Bitácoras Semanales
              </span>
              <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
                Registro cronológico de actividades con cómputo automático de horas cumplidas.
              </p>
            </div>

            <div className="flex flex-col gap-1 sm:gap-2 sm:pl-6">
              <span className="text-xs sm:text-base font-semibold text-[#242424]">
                Acreditación Oficial
              </span>
              <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
                Visado conjunto y emisión de constancias de acreditación aprobadas.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'vinculacion',
      headline: 'Vinculación con la Sociedad',
      description:
        'Programas de servicio comunitario orientados a la transferencia de conocimientos y asistencia técnica en territorio.',
      linkText: 'Consultar proyectos comunitarios',
      renderVisual: () => (
        <div className="w-full flex flex-col justify-center text-left py-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-0 sm:divide-x divide-[#e0e0e0]">
            <div className="flex flex-col gap-1 sm:gap-2 sm:pr-6">
              <span className="text-xs sm:text-base font-semibold text-[#242424]">
                Trabajo en Territorio
              </span>
              <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
                Proyectos directos en comunidades rurales y organizaciones sociales de la provincia.
              </p>
            </div>

            <div className="flex flex-col gap-1 sm:gap-2 sm:px-6">
              <span className="text-xs sm:text-base font-semibold text-[#242424]">
                Transferencia Técnica
              </span>
              <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
                Talleres de alfabetización digital, manuales de usuario y asesoramiento informático.
              </p>
            </div>

            <div className="flex flex-col gap-1 sm:gap-2 sm:pl-6">
              <span className="text-xs sm:text-base font-semibold text-[#242424]">
                Actas Finales
              </span>
              <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
                Suscripción formal de entrega-recepción de resultados para archivo universitario.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'eventos',
      headline: 'Eventos y Certificación Criptográfica',
      description:
        'Registro de asistencia en simposios académicos y expedición de diplomas protegidos mediante algoritmo SHA-256.',
      linkText: 'Verificar certificados emitidos',
      renderVisual: () => (
        <div className="w-full flex flex-col justify-center text-left py-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-0 sm:divide-x divide-[#e0e0e0]">
            <div className="flex flex-col gap-1 sm:gap-2 sm:pr-6">
              <span className="text-xs sm:text-base font-semibold text-[#242424]">
                Control de Asistencia
              </span>
              <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
                Registro automatizado de presencia en jornadas magistrales y talleres prácticos.
              </p>
            </div>

            <div className="flex flex-col gap-1 sm:gap-2 sm:px-6">
              <span className="text-xs sm:text-base font-semibold text-[#242424]">
                Criptografía SHA-256
              </span>
              <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
                Huella digital única indexada que garantiza la inmutabilidad de cada diploma.
              </p>
            </div>

            <div className="flex flex-col gap-1 sm:gap-2 sm:pl-6">
              <span className="text-xs sm:text-base font-semibold text-[#242424]">
                Validación QR Pública
              </span>
              <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
                Comprobación abierta e instantánea sin necesidad de credenciales de acceso.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (idx: number) => {
    setActiveIndex(idx);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  return (
    <section
      ref={sectionRef}
      id="highlights"
      className="w-full flex flex-col gap-6 py-6"
    >
      {/* Título de Sección Estilo Apple SF / Segoe UI */}
      <div className="w-full flex items-center justify-between mb-2">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#242424]">
          Mira lo más destacado.
        </h2>

        {/* Controles de Navegación */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full border border-[#d1d1d1] bg-white flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={prevSlide}
            className="w-8 h-8 rounded-full border border-[#d1d1d1] bg-white flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="w-8 h-8 rounded-full border border-[#d1d1d1] bg-white flex items-center justify-center text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tarjeta del Slide Activo */}
      <div className="w-full rounded-2xl md:rounded-3xl bg-white border border-[#e0e0e0] p-6 sm:p-10 md:p-12 shadow-xs flex flex-col justify-between min-h-[420px] sm:min-h-[460px] transition-all">
        {/* Cabecera del Slide */}
        <div className="flex flex-col text-left max-w-2xl gap-2 mb-6">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#242424]">
            {slides[activeIndex].headline}
          </h3>
          <p className="text-sm sm:text-base text-[#616161] leading-relaxed">
            {slides[activeIndex].description}
          </p>
        </div>

        {/* Visual en 3 Columnas Limpias */}
        <div className="my-auto py-4">
          {slides[activeIndex].renderVisual()}
        </div>

        {/* Pie: Enlace Simple de Acción */}
        <div className="pt-6 border-t border-[#edebe9] flex items-center justify-between">
          <button
            type="button"
            onClick={onEnterPortal}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f6cbd] hover:text-[#115ea3] transition-colors cursor-pointer"
          >
            <span>{slides[activeIndex].linkText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Indicadores de Paginación */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === activeIndex ? 'w-6 bg-[#0f6cbd]' : 'w-2 bg-[#d1d1d1] hover:bg-[#a19f9d]'
                }`}
                aria-label={`Ir al pilar ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
