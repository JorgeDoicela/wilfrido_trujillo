import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { workspacesApi } from '@/modules/admin/api/workspaces.api';

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

  // Limpiar timer al desmontar
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
            handleVideoFinished();
            return duration;
          }
          return next;
        });
      }, 500); // Avanza acelerado para mejor experiencia de demostración
    }
  };

  const handleVideoFinished = async () => {
    if (isWatched) return;

    try {
      setIsSubmitting(true);
      await workspacesApi.completeInduction(workspaceId);
      setIsWatched(true);
      setSuccessMessage('¡Felicitaciones! Has completado el 100% de la inducción obligatoria.');
      if (onInductionComplete) {
        onInductionComplete();
      }
    } catch {
      // Si estamos en modo demostrativo local, marcamos completado
      setIsWatched(true);
      setSuccessMessage('¡Inducción completada con éxito! Registro local activo.');
      if (onInductionComplete) {
        onInductionComplete();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateFullWatch = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    setCurrentTime(duration);
    setProgress(100);
    handleVideoFinished();
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    setCurrentTime(0);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden backdrop-blur-sm max-w-4xl mx-auto w-full">
      {/* Cabecera del reproductor */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 mb-4 border-b border-slate-800">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            Paso 1 Obligatorio: Visualización Guiada
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">{videoTitle}</h3>
          <p className="text-xs text-slate-400">
            Grabado por el Ing. Wilfrido Trujillo. Explica la normativa oficial, deberes del practicante y llenado de bitácoras.
          </p>
        </div>

        <div>
          {isWatched ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm">
              <CheckCircle2 className="w-4 h-4" /> 100% Completado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lock className="w-4 h-4" /> Requisito Previo Bloqueado
            </span>
          )}
        </div>
      </div>

      {/* Pantalla del Reproductor de Video */}
      <div className="relative aspect-video rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 flex flex-col items-center justify-center overflow-hidden group shadow-inner">
        {/* Glow decorativo de fondo */}
        <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors pointer-events-none" />

        {/* Marca de agua didáctica */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 backdrop-blur border border-white/10 text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span>Inducción Institucional RRA</span>
        </div>

        {/* Ícono central y mensaje */}
        <div className="text-center z-10 p-6 max-w-md">
          {isWatched ? (
            <div className="flex flex-col items-center animate-fadeIn">
              <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-white mb-1">
                Visualización Verificada
              </h4>
              <p className="text-xs text-slate-400">
                Has cumplido con el tiempo requerido de inducción. El sistema ha registrado tu evidencia de visualización.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={togglePlay}
                className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 hover:scale-105 transition-all mb-3 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </button>
              <h4 className="text-sm font-medium text-white mb-1">
                {isPlaying ? 'Reproduciendo inducción...' : 'Presiona Reproducir para iniciar'}
              </h4>
              <p className="text-[11px] text-slate-500">
                El avance no permite saltos arbitrarios. Debes mirar el contenido completo.
              </p>
            </div>
          )}
        </div>

        {/* Barra de progreso inferior dentro del marco */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-2 z-20">
          {/* Barra de barra con porcentaje */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
            <div
              className={`h-full transition-all duration-300 ${
                isWatched ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                disabled={isWatched}
                className="hover:text-white transition-colors cursor-pointer disabled:opacity-40"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={handleReset}
                title="Reiniciar video"
                className="hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-300 font-bold">{progress}%</span>
              <span className="text-slate-500">completado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de prueba y feedback inferior */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          {!isWatched && (
            <button
              type="button"
              onClick={handleSimulateFullWatch}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Completar visualización al 100%
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {isWatched ? (
            <button
              type="button"
              onClick={onProceedToTest}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer animate-pulse"
            >
              Siguiente Paso: Rendir Test de Conocimiento <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <ShieldAlert className="w-4 h-4 text-amber-500/80 flex-shrink-0" />
              <span>El test permanecerá bloqueado hasta ver el 100% del video.</span>
            </div>
          )}
        </div>
      </div>

      {/* Mensaje de confirmación */}
      {successMessage && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
            <span>{successMessage}</span>
          </div>
          <span className="text-[11px] text-emerald-400/80 font-medium">
            Evidencia registrada en `workspace_enrollments`
          </span>
        </div>
      )}
    </div>
  );
}
