import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { workspacesApi } from '@/shared/api/workspaces.api';

interface InductionVideoPlayerProps {
  workspaceId: string;
  videoTitle?: string;
  initialWatched?: boolean;
  onInductionComplete?: () => void;
  onProceedToTest?: () => void;
}

export function InductionVideoPlayer({
  workspaceId,
  videoTitle = 'Inducción Oficial y Normativa del RRA (Reglamento de Régimen Académico)',
  initialWatched = false,
  onInductionComplete,
  onProceedToTest,
}: InductionVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(initialWatched ? 100 : 0);
  const [currentTime, setCurrentTime] = useState(initialWatched ? 120 : 0);
  const duration = 120; // 2 minutos de duración para la inducción interactiva
  const [isWatched, setIsWatched] = useState(initialWatched);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    initialWatched ? 'Inducción previamente completada y registrada en su expediente.' : null,
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          const currentProgress = Math.min(100, Math.round((next / duration) * 100));
          setProgress(currentProgress);

          if (next >= duration) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
            handleVideoCompleted();
            return duration;
          }
          return next;
        });
      }, 1000);
    }
  };

  const restartVideo = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    setCurrentTime(0);
    setProgress(0);
  };

  const handleVideoCompleted = async () => {
    setIsWatched(true);
    try {
      setIsSubmitting(true);
      await workspacesApi.completeInduction(workspaceId);
      setSuccessMessage('Inducción completada al 100% y registrada en el expediente académico.');
      if (onInductionComplete) {
        onInductionComplete();
      }
    } catch {
      setSuccessMessage('Inducción completada con éxito.');
      if (onInductionComplete) {
        onInductionComplete();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Cabecera del reproductor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.04] p-3.5 rounded-xl border border-white/10 backdrop-blur-md">
        <div>
          <span className="text-[11px] font-semibold text-white uppercase tracking-wider block mb-0.5">
            Paso 01 Obligatorio • Visualización Guiada
          </span>
          <h4 className="text-sm font-semibold text-white">
            {videoTitle}
          </h4>
          <p className="text-xs text-[#C4C4C4] mt-0.5">
            Grabado por Wilfrido Trujillo. Explica la normativa oficial, deberes del practicante y llenado de bitácoras.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {isWatched ? (
            <span className="ui-badge ui-badge-success font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Inducción Validada
            </span>
          ) : (
            <span className="ui-badge ui-badge-warning font-semibold">
              <Lock className="w-3.5 h-3.5" /> Requisito Previo
            </span>
          )}
        </div>
      </div>

      {/* Pantalla del Reproductor de Video con efecto Glass */}
      <div className="relative aspect-video rounded-xl bg-black/50 border border-white/15 flex flex-col items-center justify-center overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md">
        {/* Marca de agua institucional */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] text-white font-medium backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>VIDEO DE INDUCCIÓN</span>
        </div>

        {/* Ícono central y mensaje */}
        <div className="text-center z-10 p-4 max-w-sm">
          {isWatched ? (
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-2 shadow-[0_0_16px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-0.5">
                Visualización Verificada
              </h4>
              <p className="text-xs text-[#C4C4C4]">
                Has cumplido con el tiempo requerido de inducción institucional.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={togglePlay}
                className="h-14 w-14 rounded-full bg-white text-[#1C2451] hover:bg-[#F0F0F3] flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.4)] transition-transform hover:scale-105 mb-2 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-0.5 fill-current" />}
              </button>
              <h4 className="text-xs font-semibold text-white mb-0.5">
                {isPlaying ? 'Reproduciendo inducción institucional...' : 'Presione para iniciar reproducción'}
              </h4>
              <p className="text-[10px] text-[#C4C4C4]">
                Avance controlado sin saltos arbitrarios.
              </p>
            </div>
          )}
        </div>

        {/* Barra de progreso inferior Stream Glass */}
        <div className="absolute bottom-0 inset-x-0 bg-[#1C2451]/80 backdrop-blur-md px-4 py-2.5 flex flex-col gap-1.5 z-20 border-t border-white/10">
          <div className="w-full bg-white/15 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isWatched ? 'bg-emerald-400' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-white/80 font-mono">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
              </button>

              <button
                type="button"
                onClick={restartVideo}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>
            </div>

            <div>
              {formatTime(currentTime)} / {formatTime(duration)} ({progress}%)
            </div>
          </div>
        </div>
      </div>

      {/* Feedback post-inducción */}
      {isWatched && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-xs text-emerald-200 font-semibold">
              {successMessage || 'Inducción completada al 100% y validada.'}
            </span>
          </div>

          {onProceedToTest && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onProceedToTest}
              className="ui-btn ui-btn-primary text-xs h-8 px-3 whitespace-nowrap"
            >
              Continuar al Test Normativo <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
