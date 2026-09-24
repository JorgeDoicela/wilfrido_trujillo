import { useState } from 'react';
import { KeyRound, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { workspacesApi } from '@/modules/admin/api/workspaces.api';
import type { WorkspaceEnrollment, Workspace } from '@/shared/types/workspace.types';

interface JoinWorkspaceCardProps {
  onJoinSuccess?: (result: {
    enrollment: WorkspaceEnrollment;
    workspace: Workspace;
    isNew: boolean;
  }) => void;
}

export function JoinWorkspaceCard({ onJoinSuccess }: JoinWorkspaceCardProps) {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const code = accessCode.trim().toUpperCase();
    if (!code) {
      setFeedback({
        type: 'error',
        message: 'Por favor ingresa un código de acceso válido.',
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await workspacesApi.joinByCode(code);
      setFeedback({
        type: 'success',
        message: result.isNew
          ? `¡Inscripción exitosa en "${result.workspace.title}"!`
          : `Ya estabas inscrito en "${result.workspace.title}". Redirigiendo...`,
      });
      setAccessCode('');
      if (onJoinSuccess) {
        onJoinSuccess(result);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string | string[] } } };
      const msg = error.response?.data?.message;
      setFeedback({
        type: 'error',
        message: Array.isArray(msg) ? msg.join(', ') : msg || 'Código de acceso no válido o inactivo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Unirse a un Espacio de Trabajo</h3>
          <p className="text-xs text-slate-400">
            Ingresa el código proporcionado por el Ing. Wilfrido Trujillo (ej. PRAC-2026)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          placeholder="CÓDIGO DE ACCESO"
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm uppercase font-mono tracking-wider focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Ingresar <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {feedback && (
        <div
          className={`mt-3 p-3 rounded-lg text-xs flex items-center gap-2 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
}
