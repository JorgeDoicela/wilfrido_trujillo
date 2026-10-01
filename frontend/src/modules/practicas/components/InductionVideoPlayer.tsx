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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fafafa] p-3 rounded-lg border border-[#e0e0e0]">
        <div>
          <span className="text-[11px] font-semibold text-[#0f6cbd] uppercase tracking-wider block mb-0.5">
            Paso 01 Obligatorio • Visualización Guiada
          </span>
          <h4 className="text-sm font-semibold text-[#242424]">
            {videoTitle}
          </h4>
          <p className="text-xs text-[#616161] mt-0.5">
            Grabado por Wilfrido Trujillo. Explica la normativa oficial, deberes del practicante y llenado de bitácoras.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {isWatched ? (
            <span className="m365-badge m365-badge--success font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Inducción Validada
            </span>
          ) : (
            <span className="m365-badge m365-badge--warning font-semibold">
              <Lock className="w-3.5 h-3.5" /> Requisito Previo
            </span>
          )}
        </div>
      </div>

      {/* Pantalla del Reproductor de Video */}
      <div className="relative aspect-video rounded-lg bg-[#1b1a19] border border-[#d1d1d1] flex flex-col items-center justify-center overflow-hidden shadow-xs">
        
        {/* Marca de agua institucional */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 text-[10px] text-white font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-[#107c10] animate-pulse" />
          <span>VIDEO DE INDUCCIÓN</span>
        </div>

        {/* Ícono central y mensaje */}
        <div className="text-center z-10 p-4 max-w-sm">
          {isWatched ? (
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-[#107c10]/20 border border-[#107c10]/40 text-[#107c10] flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-0.5">
                Visualización Verificada
              </h4>
              <p className="text-xs text-white/70">
                Has cumplido con el tiempo requerido de inducción institucional.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={togglePlay}
                className="h-14 w-14 rounded-full bg-[#0f6cbd] hover:bg-[#115ea3] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 mb-2 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
              <h4 className="text-xs font-semibold text-white mb-0.5">
                {isPlaying ? 'Reproduciendo inducción institucional...' : 'Presione para iniciar reproducción'}
              </h4>
              <p className="text-[10px] text-white/60">
                Avance controlado sin saltos arbitrarios.
              </p>
            </div>
          )}
        </div>

        {/* Barra de progreso inferior Stream */}
        <div className="absolute bottom-0 inset-x-0 bg-black/85 px-4 py-2 flex flex-col gap-1.5 z-20 border-t border-white/10">
          <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isWatched ? 'bg-[#107c10]' : 'bg-[#0f6cbd]'
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
        <div className="p-3.5 bg-[#dff6dd] border border-[#a3d9a5] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#107c10] flex-shrink-0" />
            <span className="text-xs text-[#1e4620] font-semibold">
              {successMessage || 'Inducción completada al 100% y validada.'}
            </span>
          </div>

          {onProceedToTest && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onProceedToTest}
              className="m365-btn m365-btn-primary text-xs h-8 px-3 whitespace-nowrap"
            >
              Continuar al Test Normativo <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
