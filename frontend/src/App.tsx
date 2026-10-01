import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { WorkspaceSelectorSection } from '@/modules/admin/components/WorkspaceSelectorSection';
import { PracticasOverviewPage } from '@/modules/practicas/pages/PracticasOverviewPage';
import { CertificatesSection } from '@/modules/eventos/components/CertificatesSection';
import { FeaturePillars } from '@/shared/components/FeaturePillars';
import { CreateWorkspaceModal } from '@/modules/admin/components/CreateWorkspaceModal';
import { CreateTestModal } from '@/modules/practicas/components/CreateTestModal';
import { UploadResourceModal } from '@/modules/practicas/components/UploadResourceModal';
import { ReviewDocumentModal } from '@/modules/practicas/components/ReviewDocumentModal';
import { EventQrShareModal } from '@/modules/eventos/components/EventQrShareModal';
import { IssueCertificateModal } from '@/modules/eventos/components/IssueCertificateModal';
import { PublicEventPortal } from '@/modules/eventos/pages/PublicEventPortal';
import { VerifyCertificatePortal } from '@/modules/eventos/pages/VerifyCertificatePortal';
import { workspacesApi } from '@/shared/api/workspaces.api';
import { testsApi } from '@/modules/practicas/api/tests.api';
import { resourcesApi } from '@/modules/practicas/api/resources.api';
import { documentsApi } from '@/modules/practicas/api/documents.api';
import { certificatesApi } from '@/modules/eventos/api/certificates.api';
import type { Workspace } from '@/shared/types/workspace.types';
import type { Test, TestResult } from '@/shared/types/test.types';
import type { ResourceFile } from '@/shared/types/resource.types';
import type { DocumentSubmission } from '@/shared/types/document.types';
import type { Certificate } from '@/shared/types/certificate.types';
import { FluentShell } from '@/shared/components/FluentShell';
import { LandingPage } from '@/modules/landing/pages/LandingPage';

export default function App() {
  const { setUserDirectlyForDemo } = useAuth();
  const [activeNavTab, setActiveNavTab] = useState('practicas');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [inductionWatched, setInductionWatched] = useState(false);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [resources, setResources] = useState<ResourceFile[]>([]);
  const [submissions, setSubmissions] = useState<DocumentSubmission[]>([]);
  const [mySubmissions, setMySubmissions] = useState<DocumentSubmission[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<DocumentSubmission | null>(null);
  const [publicEventCode, setPublicEventCode] = useState<string | null>(null);
  const [verifyHash, setVerifyHash] = useState<string | null>(null);
  const [currentRoute, setCurrentRoute] = useState<'landing' | 'app' | 'eventos' | 'certificados'>('landing');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateTestModalOpen, setIsCreateTestModalOpen] = useState(false);
  const [isUploadResourceModalOpen, setIsUploadResourceModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isIssueCertModalOpen, setIsIssueCertModalOpen] = useState(false);

  // Loading flags
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false);
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [isLoadingCertificates, setIsLoadingCertificates] = useState(false);

  const fetchWorkspaces = async () => {
    try {
      setIsLoadingWorkspaces(true);
      const data = await workspacesApi.getAll();
      setWorkspaces(data);
      if (data.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(data[0]);
      }
    } catch {
      if (workspaces.length === 0) {
        const defaultWorkspaces: Workspace[] = [
          {
            id: 'ws-demo-1',
            title: 'Prácticas Preprofesionales 2026-I',
            description: 'Coordinación y recepción de bitácoras oficiales para el periodo lectivo 2026.',
            type: 'PRACTICAS',
            isActive: true,
            accessCode: 'PRAC-2026',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'ws-demo-2',
            title: 'Vinculación Comunitaria: Digitalización Pymes',
            description: 'Proyecto de servicio a la comunidad para estudiantes de tercer nivel.',
            type: 'VINCULACION',
            isActive: true,
            accessCode: 'VINC-8821',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'ws-demo-3',
            title: 'Conferencia Magistral: Inteligencia Artificial en Educación Superior',
            description: 'Ponencia y taller sobre adopción ética de IA generativa y normativa RRA.',
            type: 'EVENTO',
            isActive: true,
            accessCode: 'CONF-2026',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setWorkspaces(defaultWorkspaces);
        setSelectedWorkspace(defaultWorkspaces[0]);
      }
    } finally {
      setIsLoadingWorkspaces(false);
    }
  };

  const fetchTest = async (workspaceId: string) => {
    try {
      setIsLoadingTest(true);
      const test = await testsApi.getByWorkspace(workspaceId);
      if (test) {
        setActiveTest(test);
      } else {
        setActiveTest({
          id: `test-${workspaceId}`,
          workspaceId,
          title: 'Evaluación de Normativa y Procedimiento de Prácticas',
          passingScore: 7,
          timeLimitMinutes: 15,
          questions: [
            {
              id: 'q1',
              question: '¿Cuál es el porcentaje mínimo obligatorio de visualización del video de inducción?',
              options: ['50% de la duración', '75% con salto rápido', '100% de reproducción completa sin omisiones', '80% de avance'],
              correctOptionIndex: 2,
            },
            {
              id: 'q2',
              question: '¿Qué documento debe estar debidamente legalizado antes de iniciar las horas operativas en la empresa?',
              options: ['Carta de compromiso / Convenio y Plan de Aprendizaje', 'Solo carné estudiantil', 'Factura de servicios básicos', 'Comprobante de matrícula simple'],
              correctOptionIndex: 0,
            },
            {
              id: 'q3',
              question: '¿Bajo qué formato oficial se deben consolidar y subir las bitácoras semanales?',
              options: ['Formato PDF oficial con firmas digitales o manuscritas del tutor empresarial', 'Capturas de pantalla sueltas', 'Documento de texto sin membrete', 'Mensaje por correo personal'],
              correctOptionIndex: 0,
            },
          ],
        });
      }
    } catch {
      setActiveTest({
        id: `test-${workspaceId}`,
        workspaceId,
        title: 'Evaluación de Normativa y Procedimiento de Prácticas',
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 'q1',
            question: '¿Cuál es el porcentaje mínimo obligatorio de visualización del video de inducción?',
            options: ['50% de la duración', '75% con salto rápido', '100% de reproducción completa sin omisiones', '80% de avance'],
            correctOptionIndex: 2,
          },
          {
            id: 'q2',
            question: '¿Qué documento debe estar debidamente legalizado antes de iniciar las horas operativas en la empresa?',
            options: ['Carta de compromiso / Convenio y Plan de Aprendizaje', 'Solo carné estudiantil', 'Factura de servicios básicos', 'Comprobante de matrícula simple'],
            correctOptionIndex: 0,
          },
          {
            id: 'q3',
            question: '¿Bajo qué formato oficial se deben consolidar y subir las bitácoras semanales?',
            options: ['Formato PDF oficial con firmas digitales o manuscritas del tutor empresarial', 'Capturas de pantalla sueltas', 'Documento de texto sin membrete', 'Mensaje por correo personal'],
            correctOptionIndex: 0,
          },
        ],
      });
    } finally {
      setIsLoadingTest(false);
    }
  };

  const fetchResources = async (workspaceId: string) => {
    try {
      setIsLoadingResources(true);
      const data = await resourcesApi.getByWorkspace(workspaceId);
      setResources(data);
    } catch {
      setResources([
        {
          id: 'res-demo-1',
          workspaceId,
          title: 'Guía Oficial de Prácticas Preprofesionales y RRA',
          fileUrl: 'guia_oficial_practicas.pdf',
          fileType: 'pdf',
          isLockedUntilTestPass: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'res-demo-2',
          workspaceId,
          title: 'Plan de Aprendizaje y Convenio Empresarial (Formato A1)',
          fileUrl: 'formato_a1_convenio_plan.docx',
          fileType: 'word',
          isLockedUntilTestPass: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'res-demo-3',
          workspaceId,
          title: 'Bitácora Semanal de Horas y Control de Actividades (Formato B2)',
          fileUrl: 'formato_b2_bitacora_semanal.xlsx',
          fileType: 'excel',
          isLockedUntilTestPass: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoadingResources(false);
    }
  };

  const fetchSubmissions = async (workspaceId: string) => {
    try {
      setIsLoadingSubmissions(true);
      const [allSubs, mySubs] = await Promise.allSettled([
        documentsApi.getWorkspaceSubmissions(workspaceId),
        documentsApi.getMySubmissions(workspaceId),
      ]);

      if (allSubs.status === 'fulfilled' && allSubs.value.length > 0) {
        setSubmissions(allSubs.value);
      } else {
        setSubmissions([
          {
            id: 'sub-sample-1',
            enrollmentId: 'enr-1',
            documentTitle: 'Bitácora Semanal 1 y 2 - Convenio Activo',
            fileUrl: 'bitacora_semanal_1.pdf',
            status: 'submitted',
            feedbackNotes: null,
            auditedAt: null,
            approvedAt: null,
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            enrollment: {
              id: 'enr-1',
              user: {
                id: 'u-1',
                fullName: 'Carlos Estudiante',
                email: 'alumno@instituto.edu.ec',
                identification: '1723456789',
              },
            },
          },
          {
            id: 'sub-sample-2',
            enrollmentId: 'enr-2',
            documentTitle: 'Convenio de Prácticas Firmado y Legalizado',
            fileUrl: 'convenio_legalizado.pdf',
            status: 'approved',
            feedbackNotes: 'Validado conforme a la normativa institucional vigente.',
            auditedAt: new Date().toISOString(),
            approvedAt: new Date().toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
            updatedAt: new Date().toISOString(),
            enrollment: {
              id: 'enr-2',
              user: {
                id: 'u-2',
                fullName: 'María Estudiante',
                email: 'maria@instituto.edu.ec',
                identification: '1723456790',
              },
            },
          },
        ]);
      }

      if (mySubs.status === 'fulfilled' && mySubs.value.length > 0) {
        setMySubmissions(mySubs.value);
      } else {
        setMySubmissions([
          {
            id: 'sub-my-sample',
            enrollmentId: 'enr-me',
            documentTitle: 'Bitácora Semanal 1 y 2 - Convenio Activo',
            fileUrl: 'bitacora_semanal_1.pdf',
            status: 'submitted',
            feedbackNotes: null,
            auditedAt: null,
            approvedAt: null,
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
        ]);
      }
    } catch {
      // Ignorar fallback silencioso
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const fetchCertificates = async (workspaceId: string) => {
    try {
      setIsLoadingCertificates(true);
      const data = await certificatesApi.getByWorkspace(workspaceId);
      if (data && data.length > 0) {
        setCertificates(data);
      } else {
        setCertificates([
          {
            id: 'cert-demo-1',
            workspaceId,
            recipientName: 'Carlos Estudiante',
            recipientEmail: 'alumno@instituto.edu.ec',
            recipientIdentification: '1723456789',
            hours: 160,
            verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            pdfPath: 'cert_carlos_estudiante.pdf',
            issuedAt: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setCertificates([
        {
          id: 'cert-demo-1',
          workspaceId,
          recipientName: 'Carlos Estudiante',
          recipientEmail: 'alumno@instituto.edu.ec',
          recipientIdentification: '1723456789',
          hours: 160,
          verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          pdfPath: 'cert_carlos_estudiante.pdf',
          issuedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoadingCertificates(false);
    }
  };

  // Enrutamiento mediante hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/eventos/')) {
        const code = hash.replace('#/eventos/', '');
        setPublicEventCode(code);
        setVerifyHash(null);
        setCurrentRoute('eventos');
      } else if (hash.startsWith('#/certificados/validar/')) {
        const h = hash.replace('#/certificados/validar/', '');
        setVerifyHash(h);
        setPublicEventCode(null);
        setCurrentRoute('certificados');
      } else if (
        hash.startsWith('#/app') ||
        hash.startsWith('#/practicas') ||
        hash.startsWith('#/vinculacion') ||
        hash.startsWith('#/certificados') ||
        hash.startsWith('#/eventos') ||
        hash.startsWith('#/espacios')
      ) {
        setPublicEventCode(null);
        setVerifyHash(null);
        setCurrentRoute('app');
        if (hash.startsWith('#/practicas')) setActiveNavTab('practicas');
        else if (hash.startsWith('#/vinculacion')) setActiveNavTab('vinculacion');
        else if (hash.startsWith('#/certificados')) setActiveNavTab('certificados');
        else if (hash.startsWith('#/eventos')) setActiveNavTab('eventos');
        else if (hash.startsWith('#/espacios')) setActiveNavTab('espacios');
      } else {
        setPublicEventCode(null);
        setVerifyHash(null);
        setCurrentRoute('landing');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      fetchTest(selectedWorkspace.id);
      fetchResources(selectedWorkspace.id);
      fetchSubmissions(selectedWorkspace.id);
      fetchCertificates(selectedWorkspace.id);
    }
  }, [selectedWorkspace]);

  const simulateStudent = () => {
    setUserDirectlyForDemo({
      id: 'student-uuid-demo',
      email: 'alumno@instituto.edu.ec',
      identification: '1723456789',
      fullName: 'Carlos Estudiante',
      roleKey: 'ESTUDIANTE',
      permissions: [
        'workspace:read',
        'resource:download',
        'test:take',
        'document:submit',
        'certificate:claim',
      ],
    });
  };

  const simulateIngeniero = () => {
    setUserDirectlyForDemo({
      id: 'ingeniero-uuid-demo',
      email: 'wilfrido@trujillo.com',
      identification: '1712345678',
      fullName: 'Ing. Wilfrido Trujillo',
      roleKey: 'INGENIERO',
      permissions: [
        'workspace:create',
        'workspace:update',
        'workspace:delete',
        'workspace:read',
        'resource:manage',
        'resource:download',
        'test:manage',
        'test:take',
        'document:submit',
        'document:review',
        'document:audit_ia',
        'certificate:manage',
        'certificate:issue',
        'certificate:claim',
      ],
    });
  };

  if (currentRoute === 'eventos' && publicEventCode) {
    return (
      <PublicEventPortal
        accessCode={publicEventCode}
        onBackToApp={() => {
          setPublicEventCode(null);
          window.location.hash = '';
        }}
      />
    );
  }

  if (currentRoute === 'certificados' && verifyHash) {
    return (
      <VerifyCertificatePortal
        hash={verifyHash}
        onBackToApp={() => {
          setVerifyHash(null);
          window.location.hash = '';
        }}
      />
    );
  }

  if (currentRoute === 'landing') {
    return (
      <LandingPage
        workspaces={workspaces}
        onEnterPortal={() => {
          window.location.hash = '#/app';
        }}
        onSelectWorkspace={(ws) => {
          setSelectedWorkspace(ws);
          if (ws.type === 'PRACTICAS') setActiveNavTab('practicas');
          else if (ws.type === 'VINCULACION') setActiveNavTab('vinculacion');
          else if (ws.type === 'EVENTO') setActiveNavTab('eventos');
          window.location.hash = '#/app';
        }}
        onJoinSpace={async (code) => {
          try {
            const res = await workspacesApi.joinByCode(code);
            if (res.workspace) {
              setWorkspaces((prev) => [res.workspace, ...prev]);
              setSelectedWorkspace(res.workspace);
              if (res.workspace.type === 'PRACTICAS') setActiveNavTab('practicas');
              else if (res.workspace.type === 'VINCULACION') setActiveNavTab('vinculacion');
              else if (res.workspace.type === 'EVENTO') setActiveNavTab('eventos');
              window.location.hash = '#/app';
            }
          } catch {
            const found = workspaces.find((w) => w.accessCode === code);
            if (found) {
              setSelectedWorkspace(found);
              if (found.type === 'PRACTICAS') setActiveNavTab('practicas');
              else if (found.type === 'VINCULACION') setActiveNavTab('vinculacion');
              else if (found.type === 'EVENTO') setActiveNavTab('eventos');
              window.location.hash = '#/app';
            } else {
              window.location.hash = '#/app';
            }
          }
        }}
        onVerifyCertificate={(hash) => {
          window.location.hash = `#/certificados/validar/${hash}`;
        }}
      />
    );
  }

  return (
    <FluentShell
      workspaces={workspaces}
      selectedWorkspace={selectedWorkspace}
      onSelectWorkspace={(ws) => setSelectedWorkspace(ws)}
      activeNavTab={activeNavTab}
      onSelectNavTab={(tab) => setActiveNavTab(tab)}
      onSimulateStudent={simulateStudent}
      onSimulateIngeniero={simulateIngeniero}
      onOpenCreateWorkspaceModal={() => setIsCreateModalOpen(true)}
    >
      {/* VISTA 1: PRÁCTICAS PREPROFESIONALES */}
      {activeNavTab === 'practicas' && (
        selectedWorkspace ? (
          <PracticasOverviewPage
            workspace={selectedWorkspace}
            inductionWatched={inductionWatched}
            onInductionComplete={() => setInductionWatched(true)}
            activeTest={activeTest}
            isLoadingTest={isLoadingTest}
            testResult={testResult}
            onTestPassed={(res) => setTestResult(res)}
            onOpenCreateTestModal={() => setIsCreateTestModalOpen(true)}
            resources={resources}
            isLoadingResources={isLoadingResources}
            onOpenUploadResourceModal={() => setIsUploadResourceModalOpen(true)}
            onDeleteResourceSuccess={(id) => {
              setResources((prev) => prev.filter((r) => r.id !== id));
            }}
            mySubmissions={mySubmissions}
            allSubmissions={submissions}
            isLoadingSubmissions={isLoadingSubmissions}
            onUploadSuccess={(sub) => {
              setMySubmissions((prev) => [sub, ...prev]);
              setSubmissions((prev) => [sub, ...prev]);
            }}
            onOpenReviewSubmission={(sub) => {
              setSelectedSubmissionForReview(sub);
              setIsReviewModalOpen(true);
            }}
            onOpenQrModal={() => setIsQrModalOpen(true)}
          />
        ) : (
          <WorkspaceSelectorSection
            workspaces={workspaces.filter((w) => w.type === 'PRACTICAS')}
            isLoading={isLoadingWorkspaces}
            onSelectWorkspace={(ws) => setSelectedWorkspace(ws)}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onJoinSuccess={(res) => {
              if (res.workspace) {
                setWorkspaces((prev) => [res.workspace, ...prev]);
                setSelectedWorkspace(res.workspace);
              }
            }}
          />
        )
      )}

      {/* VISTA 2: CERTIFICADOS Y REGISTRO QR (Estilo Microsoft Lists / SharePoint) */}
      {activeNavTab === 'certificados' && (
        <CertificatesSection
          certificates={certificates}
          isLoading={isLoadingCertificates}
          onOpenIssueModal={() => setIsIssueCertModalOpen(true)}
          onVerifyHash={(hash) => {
            setVerifyHash(hash);
            window.location.hash = `#/certificados/validar/${hash}`;
          }}
        />
      )}

      {/* VISTA 3: VINCULACIÓN COMUNITARIA */}
      {activeNavTab === 'vinculacion' && (
        <WorkspaceSelectorSection
          workspaces={workspaces.filter((w) => w.type === 'VINCULACION')}
          isLoading={isLoadingWorkspaces}
          onSelectWorkspace={(ws) => setSelectedWorkspace(ws)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onJoinSuccess={(res) => {
            if (res.workspace) {
              setWorkspaces((prev) => [res.workspace, ...prev]);
              setSelectedWorkspace(res.workspace);
            }
          }}
        />
      )}

      {/* VISTA 4: CONFERENCIAS Y EVENTOS */}
      {activeNavTab === 'eventos' && (
        <WorkspaceSelectorSection
          workspaces={workspaces.filter((w) => w.type === 'EVENTO')}
          isLoading={isLoadingWorkspaces}
          onSelectWorkspace={(ws) => setSelectedWorkspace(ws)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onJoinSuccess={(res) => {
            if (res.workspace) {
              setWorkspaces((prev) => [res.workspace, ...prev]);
              setSelectedWorkspace(res.workspace);
            }
          }}
        />
      )}

      {/* VISTA 5: CATÁLOGO DE ESPACIOS GENERAL */}
      {activeNavTab === 'espacios' && (
        <div className="flex flex-col gap-5">
          <WorkspaceSelectorSection
            workspaces={workspaces}
            isLoading={isLoadingWorkspaces}
            onSelectWorkspace={(ws) => {
              setSelectedWorkspace(ws);
              if (ws.type === 'PRACTICAS') setActiveNavTab('practicas');
              if (ws.type === 'VINCULACION') setActiveNavTab('vinculacion');
              if (ws.type === 'EVENTO') setActiveNavTab('eventos');
            }}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onJoinSuccess={(res) => {
              if (res.workspace) {
                setWorkspaces((prev) => [res.workspace, ...prev]);
                setSelectedWorkspace(res.workspace);
              }
            }}
          />
          <FeaturePillars />
        </div>
      )}

      {/* Modales de la aplicación */}
      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newWs) => {
          setWorkspaces((prev) => [newWs, ...prev]);
          setSelectedWorkspace(newWs);
        }}
      />

      {selectedWorkspace && (
        <>
          <CreateTestModal
            isOpen={isCreateTestModalOpen}
            workspaceId={selectedWorkspace.id}
            workspaceTitle={selectedWorkspace.title}
            onClose={() => setIsCreateTestModalOpen(false)}
            onSuccess={(created) => setActiveTest(created)}
          />

          <UploadResourceModal
            isOpen={isUploadResourceModalOpen}
            workspaceId={selectedWorkspace.id}
            workspaceTitle={selectedWorkspace.title}
            onClose={() => setIsUploadResourceModalOpen(false)}
            onSuccess={(created) => setResources((prev) => [created, ...prev])}
          />

          <EventQrShareModal
            isOpen={isQrModalOpen}
            workspaceId={selectedWorkspace.id}
            workspaceTitle={selectedWorkspace.title}
            accessCode={selectedWorkspace.accessCode}
            onClose={() => setIsQrModalOpen(false)}
            onOpenPublicPortal={(code) => {
              setPublicEventCode(code);
              window.location.hash = `#/eventos/${code}`;
            }}
          />

          <IssueCertificateModal
            isOpen={isIssueCertModalOpen}
            workspaceId={selectedWorkspace.id}
            workspaceTitle={selectedWorkspace.title}
            onClose={() => setIsIssueCertModalOpen(false)}
            onSuccess={(created) => setCertificates((prev) => [created, ...prev])}
          />
        </>
      )}

      <ReviewDocumentModal
        isOpen={isReviewModalOpen}
        submission={selectedSubmissionForReview}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedSubmissionForReview(null);
        }}
        onSuccess={(updated) => {
          setSubmissions((prev) =>
            prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
          );
          setMySubmissions((prev) =>
            prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
          );
        }}
      />
    </FluentShell>
  );
}
