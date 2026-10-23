import React from 'react';
import {
  Video,
  HelpCircle,
  FolderArchive,
  FileCheck,
  Plus,
  QrCode,
  Check,
} from 'lucide-react';
import { InductionVideoPlayer } from '../components/InductionVideoPlayer';
import { QuestionnaireTest } from '../components/QuestionnaireTest';
import { ResourceCard } from '../components/ResourceCard';
import { DocumentDropzone } from '../components/DocumentDropzone';
import { MySubmissionsList } from '../components/MySubmissionsList';
import { SubmissionsReviewTable } from '../components/SubmissionsReviewTable';
import { Can } from '@/shared/components/Can';
import { useAuth } from '@/shared/context/AuthContext';
import type { Workspace } from '@/shared/types/workspace.types';
import type { Test, TestResult } from '@/shared/types/test.types';
import type { ResourceFile } from '@/shared/types/resource.types';
import type { DocumentSubmission } from '@/shared/types/document.types';

export interface PracticasOverviewPageProps {
  workspace: Workspace;
  inductionWatched: boolean;
  onInductionComplete?: () => void;
  activeTest: Test | null;
  isLoadingTest: boolean;
  testResult: TestResult | null;
  onTestPassed?: (result: TestResult) => void;
  onOpenCreateTestModal?: () => void;
  resources: ResourceFile[];
  isLoadingResources: boolean;
  onOpenUploadResourceModal?: () => void;
  onDeleteResourceSuccess?: (id: string) => void;
  mySubmissions: DocumentSubmission[];
  allSubmissions: DocumentSubmission[];
  isLoadingSubmissions: boolean;
  onUploadSuccess: (submission: DocumentSubmission) => void;
  onOpenReviewSubmission?: (submission: DocumentSubmission) => void;
  onOpenQrModal?: () => void;
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

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const steps = [
    {
      num: 1,
      id: 'induccion-section',
      title: 'Inducción en Video',
      desc: 'Reproducción al 100% de la inducción legal.',
      status: inductionWatched ? 'Completado' : 'Pendiente',
      statusType: inductionWatched ? 'success' : 'warning',
      isCompleted: inductionWatched,
      isActive: !inductionWatched,
      meta: inductionWatched ? '100% Verificado' : 'En espera',
    },
    {
      num: 2,
      id: 'evaluacion-section',
      title: 'Test Normativo',
      desc: 'Cuestionario institucional de reglamento RRA.',
      status: testResult?.passed ? 'Aprobado' : inductionWatched ? 'Disponible' : 'Bloqueado',
      statusType: testResult?.passed ? 'success' : inductionWatched ? 'info' : 'neutral',
      isCompleted: !!testResult?.passed,
      isActive: inductionWatched && !testResult?.passed,
      meta: testResult?.passed ? `Nota: ${testResult.scoreObtained}/10` : 'Mínimo 7.0 / 10',
    },
    {
      num: 3,
      id: 'recursos-section',
      title: 'Formatos Oficiales',
      desc: 'Convenio marco, bitácoras y rúbricas.',
      status: `${resources.length} Plantillas`,
      statusType: 'info',
      isCompleted: (testResult?.passed ?? false) && resources.length > 0,
      isActive: !!testResult?.passed,
      meta: `${resources.length} archivos disponibles`,
    },
    {
      num: 4,
      id: 'documentos-section',
      title: 'Entrega y Auditoría',
      desc: 'Consignación con dictamen estructural RRA.',
      status: allSubmissions.length > 0 ? `${allSubmissions.length} Entregas` : 'Buzón',
      statusType: allSubmissions.length > 0 ? 'success' : 'warning',
      isCompleted: allSubmissions.some((s) => s.status === 'approved'),
      isActive: !!testResult?.passed,
      meta: `${allSubmissions.length} expedientes registrados`,
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Stepper Glassmorphism */}
      <div className="glass-card p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-white/10">
          <div>
            <span className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wider block">
              Proceso Secuencial de Acreditación
            </span>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Flujo Guiado de Prácticas Preprofesionales
            </h2>
          </div>
          <span className="text-xs font-medium text-[#C4C4C4] bg-white/10 px-3 py-1 rounded-full border border-white/15">
            Régimen RRA CES 2026
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {steps.map((st) => (
            <div
              key={st.num}
              onClick={() => scrollToSection(st.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between backdrop-blur-xl ${
                st.isCompleted
                  ? 'bg-emerald-500/15 border-emerald-500/35 border-t-emerald-400/60 hover:bg-emerald-500/25 shadow-sm'
                  : st.isActive
                  ? 'bg-gradient-to-br from-white/25 to-white/10 border-white/40 border-t-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.7)] ring-1 ring-white/30'
                  : 'bg-white/[0.04] border-white/10 border-t-white/20 hover:bg-white/[0.08] hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        st.isCompleted
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : st.isActive
                          ? 'bg-white text-[#1C2451] shadow-xs'
                          : 'bg-white/10 text-[#C4C4C4]'
                      }`}
                    >
                      {st.isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : st.num}
                    </span>
                    <span className="text-[11px] font-semibold text-[#C4C4C4]">
                      Paso 0{st.num}
                    </span>
                  </div>

                  <span
                    className={`ui-badge ${
                      st.statusType === 'success'
                        ? 'ui-badge-success'
                        : st.statusType === 'warning'
                        ? 'ui-badge-warning'
                        : st.statusType === 'info'
                        ? 'ui-badge-info'
                        : 'ui-badge-neutral'
                    } text-[10px]`}
                  >
                    {st.status}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-white">
                  {st.title}
                </h4>
                <p className="text-[11px] text-[#C4C4C4] mt-0.5 leading-tight">
                  {st.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 text-[10px] font-mono text-[#F0F0F3]/80">
                {st.meta}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección 1: Inducción con Video Player y Tracking */}
      <section id="induccion-section" className="glass-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white">
              Módulo 01: Inducción Legal con Tracking de Reproducción
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onOpenQrModal}
              title="Abrir portal público y código QR para asistentes móviles"
              className="ui-btn ui-btn-secondary text-xs h-7.5 px-2.5"
            >
              <QrCode className="w-3.5 h-3.5" /> Portal QR & Asistentes
            </button>
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
      <section id="evaluacion-section" className="glass-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white">
              Módulo 02: Evaluación Normativa y Procedimiento RRA
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {testResult?.passed && (
              <span className="ui-badge ui-badge-success text-xs font-semibold">
                Aprobado ({testResult.scoreObtained}/10)
              </span>
            )}
            <Can do="test:manage">
              <button
                type="button"
                onClick={onOpenCreateTestModal}
                className="ui-btn ui-btn-primary text-xs h-7.5 px-2.5"
              >
                <Plus className="w-3.5 h-3.5" /> Nuevo Cuestionario
              </button>
            </Can>
          </div>
        </div>

        {isLoadingTest ? (
          <div className="p-8 text-center text-xs text-[#C4C4C4]">
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
          <div className="p-6 text-center text-xs text-[#C4C4C4] bg-white/[0.03] rounded-xl border border-white/10">
            No hay evaluaciones configuradas para este espacio de trabajo.
          </div>
        )}
      </section>

      {/* Sección 3: Repositorio de Recursos y Formatos */}
      <section id="recursos-section" className="glass-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-white" />
              <h3 className="text-sm font-semibold text-white">
                Módulo 03: Plantillas Institucionales y Formatos Oficiales
              </h3>
            </div>
            <p className="text-xs text-[#C4C4C4] mt-0.5">
              Descarga directa de documentos oficiales. Las plantillas con candado requieren haber superado el test normativo.
            </p>
          </div>

          <Can do="resource:manage">
            <button
              type="button"
              onClick={onOpenUploadResourceModal}
              className="ui-btn ui-btn-primary text-xs h-7.5 px-2.5"
            >
              <Plus className="w-3.5 h-3.5" /> Subir Plantilla
            </button>
          </Can>
        </div>

        {isLoadingResources ? (
          <div className="p-8 text-center text-xs text-[#C4C4C4]">
            Cargando repositorio de recursos...
          </div>
        ) : resources.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#C4C4C4] bg-white/[0.03] rounded-xl border border-white/10">
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
      <section id="documentos-section" className="glass-card p-5 flex flex-col gap-4">
        <div className="pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white">
              Módulo 04: Bandeja Oficial de Entregas & Auditoría Documental
            </h3>
          </div>
          <p className="text-xs text-[#C4C4C4] mt-0.5">
            Consignación de bitácoras firmadas, convenios legalizados y emisión de dictamen heurístico normativo.
          </p>
        </div>

        <Can
          do="document:review"
          fallback={
            <div className="space-y-5">
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
