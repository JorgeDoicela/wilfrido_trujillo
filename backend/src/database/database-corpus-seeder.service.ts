import * as fs from 'node:fs';
import * as path from 'node:path';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import PDFDocument from 'pdfkit';
import { User } from '../users/entities/user.entity.js';
import { Permission } from '../auth/enums/permission.enum.js';
import { Workspace, WorkspaceType } from '../workspaces/entities/workspace.entity.js';
import {
  WorkspaceEnrollment,
  EnrollmentStatus,
} from '../workspaces/entities/workspace-enrollment.entity.js';
import { ResourceFile } from '../resources/entities/resource-file.entity.js';
import { Test, TestQuestion } from '../tests/entities/test.entity.js';
import { TestAttempt } from '../tests/entities/test-attempt.entity.js';
import {
  DocumentSubmission,
  SubmissionStatus,
} from '../submissions/entities/document-submission.entity.js';
import { Certificate } from '../certificates/entities/certificate.entity.js';
import { EventFeedback } from '../events/entities/event-feedback.entity.js';
import { DocumentAuditResult } from '../auditor/interfaces/document-auditor.interface.js';

interface CorpusStudentSeed {
  identification: string;
  fullName: string;
  email: string;
}

@Injectable()
export class DatabaseCorpusSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseCorpusSeederService.name);
  private readonly documentsDir = path.resolve(process.cwd(), 'uploads', 'documents');
  private readonly resourcesDir = path.resolve(process.cwd(), 'uploads', 'resources');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceEnrollment)
    private readonly enrollmentRepository: Repository<WorkspaceEnrollment>,
    @InjectRepository(ResourceFile)
    private readonly resourceRepository: Repository<ResourceFile>,
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
    @InjectRepository(TestAttempt)
    private readonly attemptRepository: Repository<TestAttempt>,
    @InjectRepository(DocumentSubmission)
    private readonly submissionRepository: Repository<DocumentSubmission>,
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    @InjectRepository(EventFeedback)
    private readonly feedbackRepository: Repository<EventFeedback>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.ensureDirectories();
    const workspaces = await this.ensureBaseWorkspaces();
    const students = await this.seedCorpusStudents();
    const testsByCode = await this.seedTests(workspaces);
    await this.seedResources(workspaces);
    const enrollmentsMap = await this.seedEnrollmentsAndAttempts(
      workspaces,
      students,
      testsByCode,
    );
    await this.seedDocumentSubmissions(enrollmentsMap, students);
    await this.seedEventFeedbacks(workspaces);
    await this.seedCertificates(workspaces);
  }

  private ensureDirectories(): void {
    for (const dir of [this.documentsDir, this.resourcesDir]) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  private async ensureBaseWorkspaces(): Promise<Record<string, Workspace>> {
    const definitions: Array<{
      accessCode: string;
      title: string;
      description: string;
      type: WorkspaceType;
      inductionVideoUrl: string | null;
    }> = [
      {
        accessCode: 'PRAC-2026',
        title: 'Prácticas Preprofesionales 2026',
        description:
          'Espacio oficial para seguimiento, inducción obligatoria, bitácoras semanales e informe final de prácticas.',
        type: WorkspaceType.PRACTICAS,
        inductionVideoUrl: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
      },
      {
        accessCode: 'VINC-2026',
        title: 'Vinculación con la Sociedad 2026',
        description:
          'Gestión y control de proyectos comunitarios, bitácoras de campo y acreditación de horas de servicio.',
        type: WorkspaceType.VINCULACION,
        inductionVideoUrl: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
      },
      {
        accessCode: 'CONF-IA',
        title: 'Conferencia: Inteligencia Artificial y Soberanía',
        description:
          'Taller magistral sobre soberanía tecnológica, agentes de IA locales y desarrollo de software moderno.',
        type: WorkspaceType.EVENTO,
        inductionVideoUrl: null,
      },
    ];

    const result: Record<string, Workspace> = {};

    for (const def of definitions) {
      let ws = await this.workspaceRepository.findOne({
        where: { accessCode: def.accessCode },
      });

      if (!ws) {
        ws = this.workspaceRepository.create({
          title: def.title,
          description: def.description,
          type: def.type,
          accessCode: def.accessCode,
          inductionVideoUrl: def.inductionVideoUrl,
          isActive: true,
        });
        ws = await this.workspaceRepository.save(ws);
      } else if (
        ws.inductionVideoUrl &&
        ws.inductionVideoUrl.includes('dQw4w9WgXcQ') &&
        def.inductionVideoUrl
      ) {
        ws.inductionVideoUrl = def.inductionVideoUrl;
        ws = await this.workspaceRepository.save(ws);
      }

      result[def.accessCode] = ws;
    }

    return result;
  }

  private async seedCorpusStudents(): Promise<Record<string, User>> {
    const seeds: CorpusStudentSeed[] = [
      {
        identification: '0600000002',
        fullName: 'Juan Pérez (Estudiante)',
        email: 'estudiante@unach.edu.ec',
      },
      {
        identification: '0604128934',
        fullName: 'Camila Alejandra Cevallos Gavilánez',
        email: 'camila.cevallos@unach.edu.ec',
      },
      {
        identification: '0605219483',
        fullName: 'Mateo Sebastián Hidalgo Zurita',
        email: 'mateo.hidalgo@unach.edu.ec',
      },
      {
        identification: '0603891042',
        fullName: 'Valeria Estefanía Moreno Salazar',
        email: 'valeria.moreno@unach.edu.ec',
      },
      {
        identification: '0604782319',
        fullName: 'Andrés Fernando Paredes Vallejo',
        email: 'andres.paredes@unach.edu.ec',
      },
    ];

    const passwordHash = await bcrypt.hash('Estudiante123*', 10);
    const studentPermissions = [
      Permission.WORKSPACE_READ,
      Permission.RESOURCE_DOWNLOAD,
      Permission.TEST_TAKE,
      Permission.DOCUMENT_SUBMIT,
      Permission.CERTIFICATE_CLAIM,
    ];
    const usersByIdentification: Record<string, User> = {};

    for (const seed of seeds) {
      let user = await this.userRepository.findOne({
        where: [
          { identification: seed.identification },
          { email: seed.email },
        ],
      });

      if (!user) {
        user = this.userRepository.create({
          identification: seed.identification,
          fullName: seed.fullName,
          email: seed.email,
          passwordHash,
          roleKey: 'ESTUDIANTE',
          permissionsJson: studentPermissions,
        });
        user = await this.userRepository.save(user);
      }

      usersByIdentification[seed.identification] = user;
    }

    return usersByIdentification;
  }

  private async seedTests(
    workspaces: Record<string, Workspace>,
  ): Promise<Record<string, Test>> {
    const pracQuestions: TestQuestion[] = [
      {
        id: 'prac-q1',
        question:
          '¿Cuál es el requisito previo obligatorio antes de habilitar la descarga de formatos oficiales de Prácticas Preprofesionales?',
        options: [
          'Completar el video de inducción normativa y aprobar el cuestionario con nota mínima de 8.0/10',
          'Solicitar autorización verbal al tutor de la entidad receptora',
          'Subir directamente el informe final sin carta de compromiso',
          'Presentar únicamente el carné estudiantil en secretaría',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'prac-q2',
        question:
          'Según los lineamientos del Reglamento de Régimen Académico (RRA), ¿qué elementos técnicos debe contener toda entrega documental en formato PDF?',
        options: [
          'Fotografías sueltas sin numeración ni firmas de responsabilidad',
          'Portada institucional, objetivos, desarrollo de actividades, conclusiones, recomendaciones y firmas de responsabilidad',
          'Únicamente el resumen ejecutivo de media página',
          'Capturas de pantalla escaneadas sin texto seleccionable',
        ],
        correctOptionIndex: 1,
      },
      {
        id: 'prac-q3',
        question:
          '¿Con qué periodicidad debe registrarse el avance de actividades en la bitácora de seguimiento técnico?',
        options: [
          'Una sola vez al finalizar el semestre académico',
          'De manera semanal, detallando horas ejecutadas, actividades verificables y validación del tutor',
          'Cada dos meses sin especificar fechas ni horas',
          'Solo cuando exista cambio de entidad receptora',
        ],
        correctOptionIndex: 1,
      },
      {
        id: 'prac-q4',
        question:
          '¿Qué ocurre en la plataforma cuando un archivo PDF subido corresponde a un escaneo de baja calidad sin capa de texto (OCR)?',
        options: [
          'El sistema lo aprueba automáticamente sin revisión',
          'El auditor documental heurístico reporta dictamen observado o con advertencias por ausencia de estructura textual verificable',
          'El archivo se convierte en hoja de cálculo',
          'Se elimina la cuenta del estudiante',
        ],
        correctOptionIndex: 1,
      },
      {
        id: 'prac-q5',
        question:
          '¿Quiénes deben suscribir el informe final y el registro de asistencia para su validación definitiva?',
        options: [
          'El estudiante practicante, el tutor académico designado y el responsable técnico de la entidad receptora',
          'Únicamente el representante estudiantil del paralelo',
          'Cualquier docente de otra facultad sin asignación formal',
          'No requiere firmas de responsabilidad si se envía por correo',
        ],
        correctOptionIndex: 0,
      },
    ];

    const vincQuestions: TestQuestion[] = [
      {
        id: 'vinc-q1',
        question:
          '¿Cuál es la finalidad sustantiva de los proyectos de Vinculación con la Sociedad en la educación superior?',
        options: [
          'Generar transferencia de conocimiento y soluciones técnicas medibles frente a necesidades reales de la comunidad o sector beneficiario',
          'Reemplazar las asignaturas básicas del primer nivel',
          'Realizar actividades recreativas sin planificación ni diagnóstico previo',
          'Sustituir el trabajo de titulación sin tutoría académica',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'vinc-q2',
        question:
          '¿Qué documento respalda la conformidad de la organización o comunidad beneficiaria al concluir la intervención técnica?',
        options: [
          'Acta de entrega-recepción e informe técnico final firmado por el representante de la entidad beneficiaria y el tutor',
          'Un mensaje de texto informal del coordinador',
          'El horario de clases del semestre en curso',
          'La factura de compra de suministros personales',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'vinc-q3',
        question:
          '¿Qué estructura mínima exige la auditoría documental para los informes técnicos de vinculación?',
        options: [
          'Diagnóstico situacional, objetivos del proyecto, matriz de actividades ejecutadas, indicadores de impacto, conclusiones y anexos fotográficos verificables',
          'Solo una portada con el logotipo institucional',
          'Un listado de nombres sin cédulas ni registro de horas',
          'Un archivo comprimido con código fuente sin documentación',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'vinc-q4',
        question:
          '¿Cuál es la calificación mínima requerida en esta evaluación de inducción para desbloquear las plantillas oficiales de vinculación?',
        options: [
          '5.0 sobre 10',
          '8.0 sobre 10',
          '3.0 sobre 10',
          'No existe calificación mínima',
        ],
        correctOptionIndex: 1,
      },
      {
        id: 'vinc-q5',
        question:
          'En el control de horas de servicio comunitario, ¿cómo debe justificarse cada jornada reportada?',
        options: [
          'Mediante registro cronológico de fecha, actividad técnica ejecutada, número de horas y evidencia verificable en el expediente PDF',
          'Con una estimación global sin fechas ni detalle de tareas',
          'Reportando más de 24 horas en un mismo día calendario',
          'Omitiendo la firma del tutor de seguimiento',
        ],
        correctOptionIndex: 0,
      },
    ];

    const result: Record<string, Test> = {};

    const specs: Array<{
      code: string;
      title: string;
      questions: TestQuestion[];
    }> = [
      {
        code: 'PRAC-2026',
        title: 'Evaluación Normativa de Inducción — Prácticas Preprofesionales RRA',
        questions: pracQuestions,
      },
      {
        code: 'VINC-2026',
        title: 'Evaluación de Inducción Metodológica — Vinculación con la Sociedad',
        questions: vincQuestions,
      },
    ];

    for (const spec of specs) {
      const ws = workspaces[spec.code];
      if (!ws) continue;

      let test = await this.testRepository.findOne({
        where: { workspaceId: ws.id },
      });

      if (!test) {
        test = this.testRepository.create({
          workspaceId: ws.id,
          title: spec.title,
          passingScore: 8,
          questions: spec.questions,
          timeLimitMinutes: 25,
        });
        test = await this.testRepository.save(test);
        this.logger.log(`Cuestionario sembrado para ${spec.code}`);
      }

      result[spec.code] = test;
    }

    return result;
  }

  private async seedResources(workspaces: Record<string, Workspace>): Promise<void> {
    const resourceDefinitions: Array<{
      workspaceCode: string;
      title: string;
      filename: string;
      fileType: string;
      isLockedUntilTestPass: boolean;
      heading: string;
      sections: Array<{ subtitle: string; body: string }>;
    }> = [
      {
        workspaceCode: 'PRAC-2026',
        title: 'Formato F-PPP-01: Carta de Compromiso y Plan de Aprendizaje',
        filename: 'formato-f-ppp-01-carta-compromiso.pdf',
        fileType: 'pdf',
        isLockedUntilTestPass: true,
        heading: 'FORMATO OFICIAL F-PPP-01 — CARTA DE COMPROMISO Y PLAN TÉCNICO',
        sections: [
          {
            subtitle: '1. OBJETIVO DEL INSTRUMENTO',
            body: 'Establecer los compromisos académicos, técnicos y éticos entre la Universidad Nacional de Chimborazo, la entidad receptora y el estudiante en formación para la ejecución de 240 horas de prácticas preprofesionales.',
          },
          {
            subtitle: '2. DATOS INFORMATIVOS OBLIGATORIOS',
            body: 'Facultad de Ingeniería — Carrera de Tecnologías de la Información / Sistemas. Incluye identificación del practicante, RUC de la institución receptora, área de asignación técnica, fechas de inicio y fin, y designación de tutores.',
          },
          {
            subtitle: '3. FIRMAS DE RESPONSABILIDAD',
            body: 'Documento válido únicamente con las firmas autógrafas o electrónicas verificables del Coordinador de Prácticas (Wilfrido Trujillo), Tutor Académico, Responsable de la Entidad Receptora y Estudiante.',
          },
        ],
      },
      {
        workspaceCode: 'PRAC-2026',
        title: 'Formato F-PPP-02: Bitácora Semanal de Seguimiento y Control de Horas',
        filename: 'formato-f-ppp-02-bitacora-semanal.pdf',
        fileType: 'pdf',
        isLockedUntilTestPass: true,
        heading: 'FORMATO OFICIAL F-PPP-02 — BITÁCORA SEMANAL DE PRÁCTICAS',
        sections: [
          {
            subtitle: '1. REGISTRO CRONOLÓGICO DE ACTIVIDADES',
            body: 'Detalle diario y semanal de tareas de ingeniería ejecutadas, herramientas utilizadas, entregables producidos, incidentes resueltos y cómputo exacto de horas efectivas.',
          },
          {
            subtitle: '2. CRITERIOS DE AUDITORÍA DOCUMENTAL',
            body: 'Al exportar este documento a PDF para su carga en plataforma, asegúrese de conservar la capa de texto nativo (no escanear como imagen plana) e incluir las secciones de Objetivos, Desarrollo, Conclusiones y Firmas.',
          },
        ],
      },
      {
        workspaceCode: 'PRAC-2026',
        title: 'Guía Normativa RRA 2026 para Expedientes de Prácticas Preprofesionales',
        filename: 'guia-normativa-rra-2026-practicas.pdf',
        fileType: 'pdf',
        isLockedUntilTestPass: false,
        heading: 'GUÍA TÉCNICA Y NORMATIVA RRA — PRÁCTICAS PREPROFESIONALES',
        sections: [
          {
            subtitle: '1. FLUJO DE ACREDITACIÓN EN PLATAFORMA',
            body: 'Paso 1: Visualizar el video de inducción. Paso 2: Aprobar el cuestionario técnico (>= 8.0/10). Paso 3: Descargar plantillas oficiales desbloqueadas. Paso 4: Subir expediente PDF al Auditor Heurístico RRA.',
          },
          {
            subtitle: '2. PARÁMETROS DEL SEMÁFORO HEURÍSTICO',
            body: 'Puntaje >= 80: Cumplimiento óptimo (Verde). Puntaje 50-79: Observaciones menores subsanables (Amarillo). Puntaje < 50: Rechazo por incumplimiento estructural o PDF sin texto seleccionable (Rojo).',
          },
        ],
      },
      {
        workspaceCode: 'VINC-2026',
        title: 'Formato F-VINC-01: Informe Técnico de Intervención y Registro de Beneficiarios',
        filename: 'formato-f-vinc-01-informe-intervencion.pdf',
        fileType: 'pdf',
        isLockedUntilTestPass: true,
        heading: 'FORMATO OFICIAL F-VINC-01 — INFORME TÉCNICO DE VINCULACIÓN',
        sections: [
          {
            subtitle: '1. DIAGNÓSTICO Y OBJETIVOS DEL PROYECTO',
            body: 'Descripción técnica de la línea base en la comunidad u organización beneficiaria, objetivos generales y específicos, e indicadores verificables de transferencia tecnológica.',
          },
          {
            subtitle: '2. MATRIZ DE EJECUCIÓN Y CONFORMIDAD',
            body: 'Desglose de jornadas de capacitación o desarrollo, listado codificado de beneficiarios directos y acta de conformidad suscrita por el representante institucional.',
          },
        ],
      },
      {
        workspaceCode: 'VINC-2026',
        title: 'Manual de Estandarización de Evidencias y Actas de Entrega-Recepción',
        filename: 'manual-evidencias-vinculacion-2026.pdf',
        fileType: 'pdf',
        isLockedUntilTestPass: false,
        heading: 'MANUAL METODOLÓGICO — EVIDENCIAS DE VINCULACIÓN CON LA SOCIEDAD',
        sections: [
          {
            subtitle: '1. REQUISITOS FORMALES DEL EXPEDIENTE',
            body: 'Todo expediente debe compilarse en un único archivo PDF estructurado entre 3 y 25 páginas, con texto seleccionable, numeración continua, conclusiones técnicas y firmas de responsabilidad.',
          },
        ],
      },
      {
        workspaceCode: 'CONF-IA',
        title: 'Presentación Magistral: Arquitecturas de Agentes Locales y Soberanía de Datos',
        filename: 'slides-conferencia-ia-soberania-2026.pdf',
        fileType: 'pdf',
        isLockedUntilTestPass: false,
        heading: 'CONFERENCIA MAGISTRAL: INTELIGENCIA ARTIFICIAL Y SOBERANÍA TECNOLÓGICA',
        sections: [
          {
            subtitle: '1. ARQUITECTURA DE SISTEMAS AUTÓNOMOS Y AUDITORÍA LOCAL',
            body: 'Ponente: Wilfrido Trujillo. Análisis de infraestructuras soberanas, ejecución determinista de heurísticas documentales, privacidad de datos institucionales y despliegue sobre servidores Linux Debian.',
          },
          {
            subtitle: '2. PATRONES DE INGENIERÍA DE SOFTWARE MODERNO',
            body: 'Diseño desacoplado mediante inversión de dependencias (DIP), persistencia transaccional SQLite en modo WAL y verificación de certificados académicos mediante código QR.',
          },
        ],
      },
    ];

    for (const def of resourceDefinitions) {
      const ws = workspaces[def.workspaceCode];
      if (!ws) continue;

      const filePath = path.join(this.resourcesDir, def.filename);
      if (!fs.existsSync(filePath)) {
        await this.generateStructuredPdf(filePath, {
          headerTitle: 'COORDINACIÓN ACADÉMICA DE PRÁCTICAS Y VINCULACIÓN',
          documentTitle: def.heading,
          metadataLine: `Espacio: ${ws.title} (${ws.accessCode}) | Responsable: Wilfrido Trujillo`,
          sections: def.sections,
          includeSignatures: true,
        });
      }

      const existing = await this.resourceRepository.findOne({
        where: {
          workspaceId: ws.id,
          title: def.title,
        },
      });

      if (!existing) {
        const resource = this.resourceRepository.create({
          workspaceId: ws.id,
          title: def.title,
          fileType: def.fileType,
          fileUrl: def.filename,
          isLockedUntilTestPass: def.isLockedUntilTestPass,
        });
        await this.resourceRepository.save(resource);
      }
    }
  }

  private async seedEnrollmentsAndAttempts(
    workspaces: Record<string, Workspace>,
    students: Record<string, User>,
    testsByCode: Record<string, Test>,
  ): Promise<Record<string, WorkspaceEnrollment>> {
    const enrollmentSpecs: Array<{
      studentIdNumber: string;
      workspaceCode: string;
      status: EnrollmentStatus;
      inductionVideoWatched: boolean;
      testPassed: boolean;
      testScore: number | null;
      answersSubmitted?: Record<string, number>;
    }> = [
      {
        studentIdNumber: '0600000002',
        workspaceCode: 'PRAC-2026',
        status: EnrollmentStatus.COMPLETED,
        inductionVideoWatched: true,
        testPassed: true,
        testScore: 10.0,
        answersSubmitted: {
          'prac-q1': 0,
          'prac-q2': 1,
          'prac-q3': 1,
          'prac-q4': 1,
          'prac-q5': 0,
        },
      },
      {
        studentIdNumber: '0600000002',
        workspaceCode: 'VINC-2026',
        status: EnrollmentStatus.ACTIVE,
        inductionVideoWatched: true,
        testPassed: true,
        testScore: 8.0,
        answersSubmitted: {
          'vinc-q1': 0,
          'vinc-q2': 0,
          'vinc-q3': 0,
          'vinc-q4': 1,
          'vinc-q5': 1,
        },
      },
      {
        studentIdNumber: '0604128934',
        workspaceCode: 'PRAC-2026',
        status: EnrollmentStatus.COMPLETED,
        inductionVideoWatched: true,
        testPassed: true,
        testScore: 10.0,
        answersSubmitted: {
          'prac-q1': 0,
          'prac-q2': 1,
          'prac-q3': 1,
          'prac-q4': 1,
          'prac-q5': 0,
        },
      },
      {
        studentIdNumber: '0604128934',
        workspaceCode: 'VINC-2026',
        status: EnrollmentStatus.COMPLETED,
        inductionVideoWatched: true,
        testPassed: true,
        testScore: 10.0,
        answersSubmitted: {
          'vinc-q1': 0,
          'vinc-q2': 0,
          'vinc-q3': 0,
          'vinc-q4': 1,
          'vinc-q5': 0,
        },
      },
      {
        studentIdNumber: '0605219483',
        workspaceCode: 'PRAC-2026',
        status: EnrollmentStatus.COMPLETED,
        inductionVideoWatched: true,
        testPassed: true,
        testScore: 8.0,
        answersSubmitted: {
          'prac-q1': 0,
          'prac-q2': 1,
          'prac-q3': 1,
          'prac-q4': 1,
          'prac-q5': 2,
        },
      },
      {
        studentIdNumber: '0603891042',
        workspaceCode: 'VINC-2026',
        status: EnrollmentStatus.COMPLETED,
        inductionVideoWatched: true,
        testPassed: true,
        testScore: 10.0,
        answersSubmitted: {
          'vinc-q1': 0,
          'vinc-q2': 0,
          'vinc-q3': 0,
          'vinc-q4': 1,
          'vinc-q5': 0,
        },
      },
      {
        studentIdNumber: '0604782319',
        workspaceCode: 'PRAC-2026',
        status: EnrollmentStatus.ACTIVE,
        inductionVideoWatched: true,
        testPassed: false,
        testScore: 6.0,
        answersSubmitted: {
          'prac-q1': 0,
          'prac-q2': 1,
          'prac-q3': 0,
          'prac-q4': 1,
          'prac-q5': 2,
        },
      },
    ];

    const enrollmentsMap: Record<string, WorkspaceEnrollment> = {};

    for (const spec of enrollmentSpecs) {
      const student = students[spec.studentIdNumber];
      const ws = workspaces[spec.workspaceCode];
      if (!student || !ws) continue;

      let enrollment = await this.enrollmentRepository.findOne({
        where: {
          userId: student.id,
          workspaceId: ws.id,
        },
      });

      if (!enrollment) {
        enrollment = this.enrollmentRepository.create({
          userId: student.id,
          workspaceId: ws.id,
          status: spec.status,
          inductionVideoWatched: spec.inductionVideoWatched,
          testPassed: spec.testPassed,
          testScore: spec.testScore,
        });
        enrollment = await this.enrollmentRepository.save(enrollment);
      }

      enrollmentsMap[`${spec.studentIdNumber}:${spec.workspaceCode}`] = enrollment;

      const test = testsByCode[spec.workspaceCode];
      if (test && spec.testScore !== null && spec.answersSubmitted) {
        const existingAttempt = await this.attemptRepository.findOne({
          where: {
            testId: test.id,
            enrollmentId: enrollment.id,
          },
        });

        if (!existingAttempt) {
          const attempt = this.attemptRepository.create({
            enrollmentId: enrollment.id,
            testId: test.id,
            scoreObtained: spec.testScore,
            passed: spec.testPassed,
            answersSubmitted: spec.answersSubmitted,
            completedAt: new Date(Date.now() - 86400000 * 3),
          });
          await this.attemptRepository.save(attempt);
        }
      }
    }

    return enrollmentsMap;
  }

  private async seedDocumentSubmissions(
    enrollmentsMap: Record<string, WorkspaceEnrollment>,
    students: Record<string, User>,
  ): Promise<void> {
    const count = await this.submissionRepository.count();
    if (count > 0) {
      return;
    }

    const submissionsSeed: Array<{
      studentIdNumber: string;
      workspaceCode: string;
      documentTitle: string;
      storedFilename: string;
      status: SubmissionStatus;
      feedbackNotes: string | null;
      auditResult: DocumentAuditResult;
      pdfTitle: string;
      includeSignatures: boolean;
    }> = [
      {
        studentIdNumber: '0604128934',
        workspaceCode: 'PRAC-2026',
        documentTitle: 'Informe Final de Prácticas Preprofesionales (F-PPP-03)',
        storedFilename: 'corpus-sub-01-camila-cevallos-prac.pdf',
        status: SubmissionStatus.APPROVED,
        feedbackNotes:
          'Expediente técnico completo y verificado conforme al Reglamento de Régimen Académico. Acreditadas las 240 horas de prácticas preprofesionales.',
        pdfTitle:
          'INFORME FINAL DE PRÁCTICAS PREPROFESIONALES — AUTOMATIZACIÓN DE INFRAESTRUCTURA Y DESPLIEGUE CONTINUO',
        includeSignatures: true,
        auditResult: {
          isValid: true,
          score: 96,
          status: 'passed',
          numPages: 6,
          characterCount: 8940,
          missingFields: [],
          observations: [
            'Auditoría RRA superada con excelencia (96/100). El expediente cumple íntegramente los requisitos formales y técnicos.',
            'Estructura verificada: Datos Informativos, Objetivos, Desarrollo de Actividades (240 horas), Conclusiones y Firmas de Responsabilidad.',
            'Densidad léxica óptima y capa de texto PDF 100% legible.',
          ],
          metadata: {
            title: 'Informe Final de Prácticas Preprofesionales',
            author: 'Camila Alejandra Cevallos Gavilánez',
            creator: 'Plataforma Wilfrido Trujillo',
          },
        },
      },
      {
        studentIdNumber: '0603891042',
        workspaceCode: 'VINC-2026',
        documentTitle: 'Informe Técnico de Intervención y Matriz de Beneficiarios (F-VINC-01)',
        storedFilename: 'corpus-sub-02-valeria-moreno-vinc.pdf',
        status: SubmissionStatus.SUBMITTED,
        feedbackNotes: null,
        pdfTitle:
          'INFORME TÉCNICO DE VINCULACIÓN CON LA SOCIEDAD — ALFABETIZACIÓN DIGITAL Y SEGURIDAD INFORMÁTICA COMUNITARIA',
        includeSignatures: true,
        auditResult: {
          isValid: true,
          score: 92,
          status: 'passed',
          numPages: 5,
          characterCount: 7420,
          missingFields: [],
          observations: [
            'Documento apto para aprobación (92/100). Cumple con todas las secciones obligatorias del Reglamento de Régimen Académico.',
            'Se verificó matriz de beneficiarios, bitácora de 160 horas de servicio comunitario y firmas de conformidad.',
          ],
          metadata: {
            title: 'Informe Técnico de Vinculación con la Sociedad',
            author: 'Valeria Estefanía Moreno Salazar',
            creator: 'Plataforma Wilfrido Trujillo',
          },
        },
      },
      {
        studentIdNumber: '0605219483',
        workspaceCode: 'PRAC-2026',
        documentTitle: 'Bitácora Mensual de Seguimiento Técnico (F-PPP-02)',
        storedFilename: 'corpus-sub-03-mateo-hidalgo-warning.pdf',
        status: SubmissionStatus.SUBMITTED,
        feedbackNotes: null,
        pdfTitle:
          'BITÁCORA MENSUAL DE SEGUIMIENTO DE PRÁCTICAS — DESARROLLO DE MICROSERVICIOS BACKEND',
        includeSignatures: false,
        auditResult: {
          isValid: true,
          score: 68,
          status: 'warning',
          numPages: 3,
          characterCount: 3480,
          missingFields: [
            'Firmas de Responsabilidad / Aprobación',
            'Recomendaciones Técnicas',
          ],
          observations: [
            'Documento aceptado con observaciones (68/100). Requiere revisión del coordinador o carga de versión subsanada.',
            'Advertencia crítica: No se detectó el bloque de Firmas de Responsabilidad del tutor de la entidad receptora ni del tutor académico.',
            'Se recomienda incorporar la sección de Recomendaciones técnicas antes de la acreditación definitiva.',
          ],
          metadata: {
            title: 'Bitácora Mensual de Prácticas',
            author: 'Mateo Sebastián Hidalgo Zurita',
          },
        },
      },
      {
        studentIdNumber: '0600000002',
        workspaceCode: 'PRAC-2026',
        documentTitle: 'Avance Preliminar de Actividades (Borrador Incompleto)',
        storedFilename: 'corpus-sub-04-estudiante-rejected.pdf',
        status: SubmissionStatus.OBSERVED,
        feedbackNotes:
          'El archivo subido carece de portada institucional, objetivos, conclusiones y firmas de responsabilidad. Subir el formato oficial F-PPP-02 completo.',
        pdfTitle: 'BORRADOR PRELIMINAR DE ACTIVIDADES SIN ESTRUCTURA RRA',
        includeSignatures: false,
        auditResult: {
          isValid: false,
          score: 28,
          status: 'rejected',
          numPages: 1,
          characterCount: 410,
          missingFields: [
            'Datos Informativos Institucionales',
            'Objetivos (General / Específicos)',
            'Conclusiones',
            'Recomendaciones',
            'Firmas de Responsabilidad / Aprobación',
          ],
          observations: [
            'Documento observado (28/100). Incumple los requisitos estructurales mínimos exigidos por el Reglamento de Régimen Académico.',
            'Extensión insuficiente: 1 página detectada (mínimo normativo requerido: 3 páginas para informes técnicos).',
            'Faltan secciones obligatorias: Datos Informativos, Objetivos, Conclusiones y Firmas de Responsabilidad.',
          ],
        },
      },
    ];

    for (const item of submissionsSeed) {
      const enrollment =
        enrollmentsMap[`${item.studentIdNumber}:${item.workspaceCode}`];
      const student = students[item.studentIdNumber];
      if (!enrollment || !student) continue;

      const fullPdfPath = path.join(this.documentsDir, item.storedFilename);
      if (!fs.existsSync(fullPdfPath)) {
        await this.generateStructuredPdf(fullPdfPath, {
          headerTitle:
            'COORDINACIÓN DE PRÁCTICAS PREPROFESIONALES Y VINCULACIÓN',
          documentTitle: item.pdfTitle,
          metadataLine: `Estudiante: ${student.fullName} (${student.identification}) | Espacio: ${item.workspaceCode}`,
          sections: [
            {
              subtitle: '1. INTRODUCCIÓN Y ANTECEDENTES',
              body: 'El presente expediente técnico documenta las actividades de ingeniería ejecutadas bajo la supervisión académica de Wilfrido Trujillo, en estricto apego al Reglamento de Régimen Académico (RRA) vigente.',
            },
            {
              subtitle: '2. OBJETIVOS GENERAL Y ESPECÍFICOS',
              body: 'Objetivo General: Aplicar estándares de arquitectura de software, auditoría heurística y aseguramiento de calidad en entornos productivos institucionales. Objetivos Específicos: Automatizar flujos operativos, documentar evidencias verificables y validar resultados con métricas de desempeño.',
            },
            {
              subtitle: '3. DESARROLLO DE ACTIVIDADES Y RESULTADOS',
              body: 'Se ejecutó el levantamiento de requerimientos, modelado relacional con integridad referencial, implementación de controles basados en permisos atómicos y validación de expedientes técnicos.',
            },
            {
              subtitle: '4. CONCLUSIONES Y RECOMENDACIONES',
              body: 'Se concluye que la sistematización de bitácoras y la validación automática previa reducen significativamente los tiempos de revisión administrativa y elevan la trazabilidad académica.',
            },
          ],
          includeSignatures: item.includeSignatures,
        });
      }

      const auditedAt = new Date(Date.now() - 86400000);
      const submission = this.submissionRepository.create({
        enrollmentId: enrollment.id,
        documentTitle: item.documentTitle,
        fileUrl: item.storedFilename,
        status: item.status,
        feedbackNotes: item.feedbackNotes,
        auditedAt,
        auditScore: item.auditResult.score,
        auditResult: item.auditResult as unknown as Record<string, unknown>,
        approvedAt:
          item.status === SubmissionStatus.APPROVED ? auditedAt : null,
      });

      await this.submissionRepository.save(submission);
    }

    this.logger.log(
      'Entregas documentales del corpus sembradas (estados: passed, warning, rejected)',
    );
  }

  private async seedEventFeedbacks(
    workspaces: Record<string, Workspace>,
  ): Promise<void> {
    const confWorkspace = workspaces['CONF-IA'];
    if (!confWorkspace) return;

    const existingCount = await this.feedbackRepository.count({
      where: { workspaceId: confWorkspace.id },
    });
    if (existingCount > 0) {
      return;
    }

    const feedbacks: Array<{
      attendeeName: string;
      attendeeEmail: string;
      attendeeIdentification: string;
      rating: number;
      clarityRating: number;
      applicableRating: number;
      comments: string;
    }> = [
      {
        attendeeName: 'Camila Alejandra Cevallos Gavilánez',
        attendeeEmail: 'camila.cevallos@unach.edu.ec',
        attendeeIdentification: '0604128934',
        rating: 5,
        clarityRating: 5,
        applicableRating: 5,
        comments:
          'Excelente demostración práctica sobre despliegue de servicios en Debian y soberanía de datos académicos sin depender de APIs privativas costosas.',
      },
      {
        attendeeName: 'Mateo Sebastián Hidalgo Zurita',
        attendeeEmail: 'mateo.hidalgo@unach.edu.ec',
        attendeeIdentification: '0605219483',
        rating: 5,
        clarityRating: 5,
        applicableRating: 4,
        comments:
          'Muy clara la explicación de arquitectura limpia y el desacoplamiento del motor de auditoría documental mediante contratos de interfaz.',
      },
      {
        attendeeName: 'Valeria Estefanía Moreno Salazar',
        attendeeEmail: 'valeria.moreno@unach.edu.ec',
        attendeeIdentification: '0603891042',
        rating: 5,
        clarityRating: 4,
        applicableRating: 5,
        comments:
          'Los casos reales presentados por Wilfrido Trujillo nos orientan directamente para estructurar nuestros informes de prácticas y vinculación.',
      },
      {
        attendeeName: 'Roberto Carlos Mancheno Viteri',
        attendeeEmail: 'roberto.mancheno@unach.edu.ec',
        attendeeIdentification: '0602984510',
        rating: 5,
        clarityRating: 5,
        applicableRating: 5,
        comments:
          'Pertinente y rigurosa exposición técnica. La verificación inmediata mediante código QR aporta transparencia institucional.',
      },
    ];

    for (const item of feedbacks) {
      const entity = this.feedbackRepository.create({
        workspaceId: confWorkspace.id,
        ...item,
      });
      await this.feedbackRepository.save(entity);
    }

    this.logger.log('Retroalimentaciones de evento CONF-IA sembradas');
  }

  private async seedCertificates(
    workspaces: Record<string, Workspace>,
  ): Promise<void> {
    const certificatesSeed: Array<{
      verificationHash: string;
      workspaceCode: string;
      recipientName: string;
      recipientEmail: string;
      recipientIdentification: string;
      hours: number;
    }> = [
      {
        verificationHash: 'WT-2026-CONF-8A4F',
        workspaceCode: 'CONF-IA',
        recipientName: 'Camila Alejandra Cevallos Gavilánez',
        recipientEmail: 'camila.cevallos@unach.edu.ec',
        recipientIdentification: '0604128934',
        hours: 40,
      },
      {
        verificationHash: 'WT-2026-PRAC-9B2C',
        workspaceCode: 'PRAC-2026',
        recipientName: 'Camila Alejandra Cevallos Gavilánez',
        recipientEmail: 'camila.cevallos@unach.edu.ec',
        recipientIdentification: '0604128934',
        hours: 240,
      },
      {
        verificationHash: 'WT-2026-VINC-3D7E',
        workspaceCode: 'VINC-2026',
        recipientName: 'Valeria Estefanía Moreno Salazar',
        recipientEmail: 'valeria.moreno@unach.edu.ec',
        recipientIdentification: '0603891042',
        hours: 160,
      },
    ];

    for (const seed of certificatesSeed) {
      const ws = workspaces[seed.workspaceCode];
      if (!ws) continue;

      const existing = await this.certificateRepository.findOne({
        where: { verificationHash: seed.verificationHash },
      });

      if (!existing) {
        const cert = this.certificateRepository.create({
          workspaceId: ws.id,
          recipientName: seed.recipientName,
          recipientEmail: seed.recipientEmail,
          recipientIdentification: seed.recipientIdentification,
          hours: seed.hours,
          verificationHash: seed.verificationHash,
          pdfPath: null,
          issuedAt: new Date(Date.now() - 86400000 * 2),
        });
        await this.certificateRepository.save(cert);
      }
    }
  }

  private generateStructuredPdf(
    filePath: string,
    options: {
      headerTitle: string;
      documentTitle: string;
      metadataLine: string;
      sections: Array<{ subtitle: string; body: string }>;
      includeSignatures: boolean;
    },
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc
        .fillColor('#1e3a8a')
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(options.headerTitle, { align: 'center' });

      doc.moveDown(0.5);
      doc
        .fillColor('#0f172a')
        .font('Helvetica-Bold')
        .fontSize(15)
        .text(options.documentTitle, { align: 'center' });

      doc.moveDown(0.4);
      doc
        .fillColor('#475569')
        .font('Helvetica')
        .fontSize(9)
        .text(options.metadataLine, { align: 'center' });

      doc.moveDown(1);

      for (const section of options.sections) {
        doc
          .fillColor('#0f172a')
          .font('Helvetica-Bold')
          .fontSize(11)
          .text(section.subtitle);
        doc.moveDown(0.3);
        doc
          .fillColor('#334155')
          .font('Helvetica')
          .fontSize(10)
          .text(section.body, { align: 'justify', lineGap: 2 });
        doc.moveDown(0.9);
      }

      if (options.includeSignatures) {
        doc.moveDown(1.5);
        doc
          .fillColor('#0f172a')
          .font('Helvetica-Bold')
          .fontSize(11)
          .text('FIRMAS DE RESPONSABILIDAD Y APROBACIÓN TÉCNICA');
        doc.moveDown(1.5);
        doc
          .fillColor('#334155')
          .font('Helvetica')
          .fontSize(10)
          .text(
            'Aprobado por: Wilfrido Trujillo — Coordinador de Prácticas Preprofesionales y Vinculación con la Sociedad.',
          );
      }

      doc.end();

      stream.on('finish', () => resolve());
      stream.on('error', reject);
    });
  }
}
