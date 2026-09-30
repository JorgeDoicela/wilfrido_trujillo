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
    <div className="flex flex-col gap-6 w-full">
      
      {/* Stepper de 4 Pasos Fluent 2 (Ref: titulacion-istpet) */}
      <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-[4px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e7eb]">
          <div>
            <span className="text-[11px] font-semibold text-[#605e5c] uppercase tracking-wider block">
              FLUJO SECUENCIAL INSTITUCIONAL
            </span>
            <h2 className="text-base font-bold text-[#1a1a1a]">
              Etapas del Proceso de Acreditación de Prácticas
            </h2>
          </div>
          <span className="text-xs font-mono text-[#605e5c] bg-[#faf9f8] px-2.5 py-1 rounded-[2px] border border-[#e5e7eb]">
            Régimen RRA CES 2026
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Paso 1 */}
          <div
            onClick={() => scrollToSection('induccion-section')}
            className={`p-3.5 rounded-[4px] border transition-all cursor-pointer flex flex-col justify-between ${
              inductionWatched
                ? 'bg-[#dff6dd]/40 border-[#107c10]/30'
                : 'bg-white border-[#e5e7eb] hover:bg-[#faf9f8]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#605e5c] uppercase font-mono">PASO 01</span>
                {inductionWatched ? (
                  <span className="fluent-badge fluent-badge--success text-[10px]">Completado</span>
                ) : (
                  <span className="fluent-badge fluent-badge--warning text-[10px]">Pendiente</span>
                )}
              </div>
              <h4 className="text-xs font-bold text-[#1a1a1a] mt-1">Inducción en Video</h4>
              <p className="text-[11px] text-[#605e5c] mt-0.5 leading-tight">
                Reproducción obligatoria al 100% de la inducción legal.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#e5e7eb]/80 text-[10px] font-mono text-[#1b2a4a]">
              {inductionWatched ? '✓ 100% Verificado' : 'En espera'}
            </div>
          </div>

          {/* Paso 2 */}
          <div
            onClick={() => scrollToSection('evaluacion-section')}
            className={`p-3.5 rounded-[4px] border transition-all cursor-pointer flex flex-col justify-between ${
              testResult?.passed
                ? 'bg-[#dff6dd]/40 border-[#107c10]/30'
                : 'bg-white border-[#e5e7eb] hover:bg-[#faf9f8]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#605e5c] uppercase font-mono">PASO 02</span>
                {testResult?.passed ? (
                  <span className="fluent-badge fluent-badge--success text-[10px]">Aprobado</span>
                ) : (
                  <span className="fluent-badge fluent-badge--neutral text-[10px]">Evaluación</span>
                )}
              </div>
              <h4 className="text-xs font-bold text-[#1a1a1a] mt-1">Test Normativo</h4>
              <p className="text-[11px] text-[#605e5c] mt-0.5 leading-tight">
                Cuestionario institucional de reglamentación interna.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#e5e7eb]/80 text-[10px] font-mono text-[#1b2a4a]">
              {testResult?.passed ? `Nota: ${testResult.scoreObtained}/10` : 'Min. 7.0 / 10'}
            </div>
          </div>

          {/* Paso 3 */}
          <div
            onClick={() => scrollToSection('recursos-section')}
            className="p-3.5 rounded-[4px] border border-[#e5e7eb] bg-white hover:bg-[#faf9f8] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#605e5c] uppercase font-mono">PASO 03</span>
                <span className="fluent-badge fluent-badge--info text-[10px]">Plantillas</span>
              </div>
              <h4 className="text-xs font-bold text-[#1a1a1a] mt-1">Formatos Oficiales</h4>
              <p className="text-[11px] text-[#605e5c] mt-0.5 leading-tight">
                Descarga de convenio A1, bitácora semanal y rúbricas.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#e5e7eb]/80 text-[10px] font-mono text-[#1b2a4a]">
              {resources.length} documentos habilitados
            </div>
          </div>

          {/* Paso 4 */}
          <div
            onClick={() => scrollToSection('documentos-section')}
            className="p-3.5 rounded-[4px] border border-[#e5e7eb] bg-white hover:bg-[#faf9f8] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#605e5c] uppercase font-mono">PASO 04</span>
                <span className="fluent-badge fluent-badge--warning text-[10px]">Buzón</span>
              </div>
              <h4 className="text-xs font-bold text-[#1a1a1a] mt-1">Entrega & Auditoría</h4>
              <p className="text-[11px] text-[#605e5c] mt-0.5 leading-tight">
                Recepción de bitácoras con dictamen heurístico RRA.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#e5e7eb]/80 text-[10px] font-mono text-[#1b2a4a]">
              {allSubmissions.length} expedientes consignados
            </div>
          </div>
        </div>
      </div>

      {/* Sección 1: Inducción con Video Player y Tracking */}
      <section id="induccion-section" className="bg-white border border-[rgba(0,0,0,0.08)] rounded-[4px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#e5e7eb]">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-[#0078d4]" />
            <h3 className="text-sm font-bold text-[#1a1a1a]">
              Módulo 01: Inducción Legal con Tracking de Reproducción
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenQrModal}
              title="Abrir portal público y código QR para asistentes móviles"
              className="gap-1.5 text-xs py-1"
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
      <section id="evaluacion-section" className="bg-white border border-[rgba(0,0,0,0.08)] rounded-[4px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#e5e7eb]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#0078d4]" />
            <h3 className="text-sm font-bold text-[#1a1a1a]">
              Módulo 02: Evaluación Normativa y Procedimiento RRA
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {testResult?.passed && (
              <span className="fluent-badge fluent-badge--success text-xs font-semibold">
                Aprobado ({testResult.scoreObtained}/10)
              </span>
            )}
            <Can do="test:manage">
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenCreateTestModal}
                className="gap-1 text-xs py-1"
              >
                <Plus className="w-3.5 h-3.5" /> Nuevo Cuestionario
              </Button>
            </Can>
          </div>
        </div>

        {isLoadingTest ? (
          <div className="p-8 text-center text-xs text-[#605e5c]">
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
          <div className="p-6 text-center text-xs text-[#605e5c] bg-[#faf9f8] rounded-[2px] border border-[#e5e7eb]">
            No hay evaluaciones configuradas para este espacio de trabajo.
          </div>
        )}
      </section>

      {/* Sección 3: Repositorio de Recursos y Formatos */}
      <section id="recursos-section" className="bg-white border border-[rgba(0,0,0,0.08)] rounded-[4px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#e5e7eb]">
          <div>
            <div className="flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-[#0078d4]" />
              <h3 className="text-sm font-bold text-[#1a1a1a]">
                Módulo 03: Plantillas Institucionales y Formatos Oficiales
              </h3>
            </div>
            <p className="text-xs text-[#605e5c] mt-0.5">
              Descarga directa de documentos oficiales. Las plantillas con candado requieren haber superado el test normativo.
            </p>
          </div>

          <Can do="resource:manage">
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenUploadResourceModal}
              className="gap-1 text-xs py-1"
            >
              <Plus className="w-3.5 h-3.5" /> Subir Plantilla
            </Button>
          </Can>
        </div>

        {isLoadingResources ? (
          <div className="p-8 text-center text-xs text-[#605e5c]">
            Cargando repositorio de recursos...
          </div>
        ) : resources.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#605e5c] bg-[#faf9f8] rounded-[2px] border border-[#e5e7eb]">
            No hay plantillas registradas en este espacio de trabajo.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
      <section id="documentos-section" className="bg-white border border-[rgba(0,0,0,0.08)] rounded-[4px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
        <div className="pb-3 border-b border-[#e5e7eb]">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#0078d4]" />
            <h3 className="text-sm font-bold text-[#1a1a1a]">
              Módulo 04: Bandeja Oficial de Entregas & Auditoría Documental
            </h3>
          </div>
          <p className="text-xs text-[#605e5c] mt-0.5">
            Consignación de bitácoras firmadas, convenios legalizados y emisión de dictamen heurístico normativo.
          </p>
        </div>

        <Can
          do="document:review"
          fallback={
            <div className="space-y-6">
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
