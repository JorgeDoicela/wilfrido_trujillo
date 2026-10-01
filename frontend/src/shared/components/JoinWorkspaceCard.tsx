import { useState } from 'react';
import { KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { workspacesApi } from '@/shared/api/workspaces.api';
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
          ? `Inscripción exitosa en "${result.workspace.title}".`
          : `Ya estás inscrito en "${result.workspace.title}".`,
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
    <div className="m365-card p-4 relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2.5 pb-2.5 mb-3 border-b border-[#edebe9]">
          <div className="h-8 w-8 rounded-md bg-[#ebf3fc] text-[#0f6cbd] flex items-center justify-center flex-shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#242424]">Unirse con Código</h4>
            <p className="text-[11px] text-[#616161]">
              Clave de acceso institucional (ej. PRAC-2026)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="CÓDIGO DE ACCESO"
            className="m365-input uppercase font-mono text-xs tracking-wider"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="m365-btn m365-btn-primary w-full text-xs h-8"
          >
            {isLoading ? 'Verificando...' : 'Validar Código'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </form>
      </div>

      {feedback && (
        <div
          className={`mt-2.5 p-2 rounded-md text-xs flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-[#dff6dd] border-[#a3d9a5] text-[#107c10]'
              : 'bg-[#fde7e9] border-[#f1aeb5] text-[#a4262c]'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="leading-tight">{feedback.message}</span>
        </div>
      )}
    </div>
  );
}
