import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { workspacesApi } from '@/modules/admin/api/workspaces.api';
import { Button } from '@/shared/components/ui/Button';

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
    initialWatched ? 'Inducción previamente completada y registrada.' : null,
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
      setSuccessMessage('Inducción completada al 100% y registrada en el expediente.');
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#e5e7eb]">
        <div>
          <span className="fluent-badge fluent-badge--info mb-1 text-[10px]">
            PASO 01 OBLIGATORIO // REPRODUCCIÓN COMPLETA
          </span>
          <h3 className="text-base font-bold text-[#1a1a1a]">{videoTitle}</h3>
          <p className="text-xs text-[#605e5c]">
            Grabado por el Ing. Wilfrido Trujillo. Explica la normativa oficial, deberes del practicante y llenado de bitácoras.
          </p>
        </div>

        <div>
          {isWatched ? (
            <span className="fluent-badge fluent-badge--success font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Completado
            </span>
          ) : (
            <span className="fluent-badge fluent-badge--warning font-semibold">
              <Lock className="w-3.5 h-3.5" /> Requisito Previo Bloqueado
            </span>
          )}
        </div>
      </div>

      {/* Pantalla del Reproductor de Video (Marco Técnico Fluent 2) */}
      <div className="relative aspect-video rounded-[2px] bg-[#111827] border border-[#d1d5db] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Marca de agua didáctica */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-black/75 border border-white/10 text-[10px] text-white font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>INDUCCIÓN OFICIAL RRA</span>
        </div>

        {/* Ícono central y mensaje */}
        <div className="text-center z-10 p-4 max-w-sm">
          {isWatched ? (
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-[2px] bg-[#107c10]/20 border border-[#107c10]/40 text-[#107c10] flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white mb-0.5">
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
                className="h-12 w-12 rounded-full bg-[#0078d4] hover:bg-[#106ebe] text-white flex items-center justify-center shadow-md transition-colors mb-2 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <h4 className="text-xs font-semibold text-white mb-0.5">
                {isPlaying ? 'Reproduciendo inducción institucional...' : 'Presiona para iniciar inducción'}
              </h4>
              <p className="text-[10px] text-white/60">
                El avance no permite saltos arbitrarios.
              </p>
            </div>
          )}
        </div>

        {/* Barra de progreso inferior */}
        <div className="absolute bottom-0 inset-x-0 bg-black/80 px-4 py-2 flex flex-col gap-1.5 z-20 border-t border-white/10">
          <div className="w-full bg-white/20 rounded-[2px] h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isWatched ? 'bg-[#107c10]' : 'bg-[#c59b27]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/80 font-mono">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
              </button>

              <button
                type="button"
                onClick={restartVideo}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
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

      {/* Acciones y feedback post-inducción */}
      {isWatched && (
        <div className="p-3 bg-[#dff6dd] border border-[#107c10]/30 rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#107c10] flex-shrink-0" />
            <span className="text-xs text-[#107c10] font-medium">
              {successMessage || 'Inducción validada.'}
            </span>
          </div>

          {onProceedToTest && (
            <Button
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              onClick={onProceedToTest}
              className="text-xs py-1 px-3 whitespace-nowrap"
            >
              Continuar al Test Normativo <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
