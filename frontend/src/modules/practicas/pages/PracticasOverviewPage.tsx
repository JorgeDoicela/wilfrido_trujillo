import React from 'react';
import {
  Video,
  HelpCircle,
  FolderArchive,
  FileCheck,
  Plus,
  QrCode,
} from 'lucide-react';
import { InductionVideoPlayer } from '../components/InductionVideoPlayer';
import { QuestionnaireTest } from '../components/QuestionnaireTest';
import { ResourceCard } from '../components/ResourceCard';
import { DocumentDropzone } from '../components/DocumentDropzone';
import { MySubmissionsList } from '../components/MySubmissionsList';
import { SubmissionsReviewTable } from '@/modules/admin/components/SubmissionsReviewTable';
import { Can } from '@/shared/components/Can';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import type { Workspace } from '@/shared/types/workspace.types';
import type { Test, TestResult } from '@/shared/types/test.types';
import type { ResourceFile } from '@/shared/types/resource.types';
import type { DocumentSubmission } from '@/shared/types/document.types';

export interface PracticasOverviewPageProps {
  workspace: Workspace;
  inductionWatched: boolean;
  onInductionComplete: () => void;
  activeTest: Test | null;
  isLoadingTest: boolean;
  testResult: TestResult | null;
  onTestPassed: (res: TestResult) => void;
  onOpenCreateTestModal: () => void;
  resources: ResourceFile[];
  isLoadingResources: boolean;
  onOpenUploadResourceModal: () => void;
  onDeleteResourceSuccess: (id: string) => void;
  mySubmissions: DocumentSubmission[];
  allSubmissions: DocumentSubmission[];
  isLoadingSubmissions: boolean;
  onUploadSuccess: (submission: DocumentSubmission) => void;
  onOpenReviewSubmission: (submission: DocumentSubmission) => void;
  onOpenQrModal: () => void;
}

export const PracticasOverviewPage: React.FC<PracticasOverviewPageProps> = ({
  workspace,
  inductionWatched,
  onInductionComplete,
  activeTest,
  isLoadingTest,
  testResult,
  onTestPassed,
  onOpenCreateTestModal,
  resources,
  isLoadingResources,
  onOpenUploadResourceModal,
  onDeleteResourceSuccess,
  mySubmissions,
  allSubmissions,
  isLoadingSubmissions,
  onUploadSuccess,
  onOpenReviewSubmission,
  onOpenQrModal,
}) => {
  const { user } = useAuth();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Sección 1: Inducción con Video Player y Tracking */}
      <section className="max-w-5xl mx-auto w-full flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Módulo de Inducción con Reproductor y Tracking
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              Espacio activo: <strong className="text-white">{workspace.title}</strong>
            </span>
            <Button
              variant="purple"
              size="sm"
              onClick={onOpenQrModal}
              title="Abrir portal público y código QR para asistentes móviles"
              className="gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5" /> Portal QR & Asistentes
            </Button>
          </div>
        </div>

        <InductionVideoPlayer
          workspaceId={workspace.id}
          videoTitle={`Inducción Oficial: ${workspace.title}`}
          initialWatched={inductionWatched}
          onInductionComplete={onInductionComplete}
          onProceedToTest={() => scrollToSection('evaluacion-section')}
        />
      </section>

      {/* Sección 2: Motor de Evaluaciones Dinámicas */}
      <section id="evaluacion-section" className="max-w-5xl mx-auto w-full flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Motor de Evaluaciones Dinámicas
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {testResult?.passed && (
              <Badge variant="success">
                Aprobado ({testResult.scoreObtained}/10)
              </Badge>
            )}
            <Can do="test:manage">
              <Button
                variant="purple"
                size="sm"
                onClick={onOpenCreateTestModal}
                className="gap-1.5"
              >
                <Plus className="w-4 h-4" /> Configurar Nuevo Examen
              </Button>
            </Can>
          </div>
        </div>

        {isLoadingTest ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            Cargando cuestionario de evaluación...
          </div>
        ) : activeTest ? (
          <QuestionnaireTest
            test={activeTest}
            inductionWatched={inductionWatched}
            onTestPassed={onTestPassed}
            onProceedToResources={() => scrollToSection('recursos-section')}
          />
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            No hay evaluaciones configuradas para este espacio de trabajo.
          </div>
        )}
      </section>

      {/* Sección 3: Repositorio de Recursos y Desbloqueo Condicional */}
      <section id="recursos-section" className="max-w-5xl mx-auto w-full flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Repositorio de Recursos y Desbloqueo Condicional
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Plantillas y formatos institucionales oficiales. Los formatos con candado requieren haber aprobado la evaluación.
            </p>
          </div>

          <Can do="resource:manage">
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenUploadResourceModal}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" /> Subir Nueva Plantilla
            </Button>
          </Can>
        </div>

        {isLoadingResources ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            Cargando repositorio de recursos...
          </div>
        ) : resources.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            No hay plantillas registradas en este espacio de trabajo.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                testPassed={testResult?.passed ?? false}
                canManage={user?.roleKey === 'INGENIERO' || user?.roleKey === 'SUPERADMIN'}
                onDeleteSuccess={onDeleteResourceSuccess}
              />
            ))}
          </div>
        )}
      </section>

      {/* Sección 4: Sistema Documental y Bandeja de Entregas */}
      <section id="documentos-section" className="max-w-5xl mx-auto w-full flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Sistema Documental y Bandeja de Entregas
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Carga de bitácoras de actividades, convenios legalizados y revisión institucional con retroalimentación.
          </p>
        </div>

        <Can
          do="document:review"
          fallback={
            <div className="space-y-8">
              <DocumentDropzone
                workspaceId={workspace.id}
                testPassed={testResult?.passed ?? false}
                onUploadSuccess={onUploadSuccess}
              />

              <MySubmissionsList submissions={mySubmissions} />
            </div>
          }
        >
          <SubmissionsReviewTable
            submissions={allSubmissions}
            isLoading={isLoadingSubmissions}
            onOpenReview={onOpenReviewSubmission}
          />
        </Can>
      </section>
    </div>
  );
};
