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
    <Card className="relative overflow-hidden">
      <CardHeader className="flex items-center gap-2.5 pb-2.5 mb-2.5 border-b border-[#e5e7eb]">
        <div className="h-8 w-8 rounded-[2px] bg-[#e6f2fb] text-[#0078d4] flex items-center justify-center flex-shrink-0">
          <KeyRound className="w-4 h-4" />
        </div>
        <div>
          <CardTitle className="text-xs font-bold text-[#1a1a1a]">Unirse a un Espacio</CardTitle>
          <CardDescription className="text-[11px] text-[#605e5c]">
            Ingresa el código proporcionado (ej. PRAC-2026)
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="CÓDIGO DE ACCESO"
            className="uppercase font-mono text-xs tracking-wider"
          />
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full text-xs py-1.5"
          >
            Validar Código <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </form>

        {feedback && (
          <div
            className={`mt-2 p-2 rounded-[2px] text-xs flex items-center gap-2 border ${
              feedback.type === 'success'
                ? 'bg-[#dff6dd] border-[#107c10]/30 text-[#107c10]'
                : 'bg-[#fde7e9] border-[#a4262c]/30 text-[#a4262c]'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            )}
            <span className="text-[11px]">{feedback.message}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
