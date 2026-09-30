import { useState } from 'react';
import { KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { workspacesApi } from '@/modules/admin/api/workspaces.api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
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
    <Card className="relative overflow-hidden shadow-xl">
      <CardHeader className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <CardTitle className="text-sm">Unirse a un Espacio de Trabajo</CardTitle>
          <CardDescription className="text-xs">
            Ingresa el código proporcionado por el Ing. Wilfrido Trujillo (ej. PRAC-2026)
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-center">
          <Input
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="CÓDIGO DE ACCESO"
            className="uppercase font-mono tracking-wider text-center sm:text-left"
          />
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full sm:w-auto text-xs py-2.5 px-4 whitespace-nowrap"
          >
            Ingresar <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {feedback && (
          <div
            className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 animate-fadeIn border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
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
      </CardContent>
    </Card>
  );
}
