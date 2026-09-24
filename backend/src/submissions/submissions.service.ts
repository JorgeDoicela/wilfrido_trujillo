import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DocumentSubmission, SubmissionStatus } from './entities/document-submission.entity.js';
import { WorkspaceEnrollment } from '../workspaces/entities/workspace-enrollment.entity.js';
import { Workspace } from '../workspaces/entities/workspace.entity.js';
import { CreateSubmissionDto } from './dto/create-submission.dto.js';
import { ReviewSubmissionDto } from './dto/review-submission.dto.js';
import { Permission } from '../auth/enums/permission.enum.js';
import {
  DOCUMENT_AUDITOR,
} from '../auditor/interfaces/document-auditor.interface.js';
import type {
  IDocumentAuditor,
  DocumentAuditResult,
} from '../auditor/interfaces/document-auditor.interface.js';
import { Inject } from '@nestjs/common';

export interface SubmissionDownloadInfo {
  filePath: string;
  filename: string;
  mimeType: string;
}

@Injectable()
export class SubmissionsService {
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads', 'documents');

  constructor(
    @InjectRepository(DocumentSubmission)
    private readonly submissionRepository: Repository<DocumentSubmission>,
    @InjectRepository(WorkspaceEnrollment)
    private readonly enrollmentRepository: Repository<WorkspaceEnrollment>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @Inject(DOCUMENT_AUDITOR)
    private readonly documentAuditor: IDocumentAuditor,
  ) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async submitDocument(
    userId: string,
    createDto: CreateSubmissionDto,
    file?: Express.Multer.File,
  ): Promise<DocumentSubmission> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        workspaceId: createDto.workspaceId,
        userId,
      },
    });

    if (!enrollment) {
      throw new BadRequestException(
        'No estás inscrito en este espacio de trabajo para realizar entregas.',
      );
    }

    if (!enrollment.inductionVideoWatched) {
      throw new BadRequestException(
        'Acceso denegado: Debes completar la inducción obligatoria al 100% antes de subir bitácoras o informes.',
      );
    }

    if (!enrollment.testPassed) {
      throw new BadRequestException(
        'Acceso denegado: Debes aprobar la evaluación diagnóstica de inducción antes de entregar tus documentos oficiales.',
      );
    }

    let fileUrl = createDto.fileUrl || '';
    let auditScore: number | null = null;
    let auditResult: Record<string, unknown> | null = null;
    let auditedAt: Date | null = null;

    if (file) {
      fileUrl = file.filename;
      // Auto-auditoría heurística inmediata para entregas en PDF
      if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
        try {
          const filePath = file.path || path.join(this.uploadDir, file.filename);
          if (fs.existsSync(filePath)) {
            const buffer = fs.readFileSync(filePath);
            const res = await this.documentAuditor.audit(buffer, createDto.documentTitle);
            auditScore = res.score;
            auditResult = res as unknown as Record<string, unknown>;
            auditedAt = new Date();
          }
        } catch {
          // Continuar con la creación sin bloquear en caso de excepción de lectura
        }
      }
    } else if (!fileUrl) {
      throw new BadRequestException('Debes adjuntar un archivo digital para tu entrega.');
    }

    const submission = this.submissionRepository.create({
      enrollmentId: enrollment.id,
      documentTitle: createDto.documentTitle.trim(),
      fileUrl,
      status: SubmissionStatus.SUBMITTED,
      feedbackNotes: null,
      auditedAt,
      auditScore,
      auditResult,
      approvedAt: null,
    });

    return this.submissionRepository.save(submission);
  }

  async getMySubmissions(userId: string, workspaceId: string): Promise<DocumentSubmission[]> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        workspaceId,
        userId,
      },
    });

    if (!enrollment) {
      return [];
    }

    return this.submissionRepository.find({
      where: { enrollmentId: enrollment.id },
      order: { createdAt: 'DESC' },
    });
  }

  async findByWorkspace(workspaceId: string): Promise<DocumentSubmission[]> {
    const submissions = await this.submissionRepository
      .createQueryBuilder('submission')
      .innerJoinAndSelect('submission.enrollment', 'enrollment')
      .innerJoinAndSelect('enrollment.user', 'user')
      .where('enrollment.workspaceId = :workspaceId', { workspaceId })
      .orderBy('submission.createdAt', 'DESC')
      .getMany();

    return submissions;
  }

  async review(submissionId: string, reviewDto: ReviewSubmissionDto): Promise<DocumentSubmission> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: {
        enrollment: true,
      },
    });

    if (!submission) {
      throw new NotFoundException(`Entrega con ID "${submissionId}" no encontrada.`);
    }

    submission.status = reviewDto.status;
    submission.feedbackNotes = reviewDto.feedbackNotes ? reviewDto.feedbackNotes.trim() : null;
    submission.auditedAt = new Date();

    if (reviewDto.status === SubmissionStatus.APPROVED) {
      submission.approvedAt = new Date();
    } else {
      submission.approvedAt = null;
    }

    return this.submissionRepository.save(submission);
  }

  async auditSubmission(
    submissionId: string,
    userId: string,
    permissions: string[] = [],
  ): Promise<{ submission: DocumentSubmission; auditResult: DocumentAuditResult }> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: {
        enrollment: {
          user: true,
        },
      },
    });

    if (!submission) {
      throw new NotFoundException(`Entrega con ID "${submissionId}" no encontrada.`);
    }

    const isTeacher = permissions.includes(Permission.DOCUMENT_REVIEW);
    const isOwner = submission.enrollment?.userId === userId;

    if (!isTeacher && !isOwner) {
      throw new ForbiddenException('No tienes permisos para auditar este documento.');
    }

    let filePath = path.join(this.uploadDir, submission.fileUrl);
    if (!fs.existsSync(filePath)) {
      filePath = this.generateSampleEvidenceFile(submission);
    }

    const fileBuffer = fs.readFileSync(filePath);
    const auditResult = await this.documentAuditor.audit(fileBuffer, submission.documentTitle);

    submission.auditScore = auditResult.score;
    submission.auditResult = auditResult as unknown as Record<string, unknown>;
    submission.auditedAt = new Date();

    const saved = await this.submissionRepository.save(submission);
    return { submission: saved, auditResult };
  }

  async auditDirectBuffer(
    fileBuffer: Buffer,
    documentType = 'general',
  ): Promise<DocumentAuditResult> {
    return this.documentAuditor.audit(fileBuffer, documentType);
  }

  async getDownloadInfo(
    submissionId: string,
    userId: string,
    permissions: string[] = [],
    roleKey = '',
  ): Promise<SubmissionDownloadInfo> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: {
        enrollment: {
          user: true,
        },
      },
    });

    if (!submission) {
      throw new NotFoundException(`Entrega con ID "${submissionId}" no encontrada.`);
    }

    const isReviewer =
      permissions.includes(Permission.DOCUMENT_REVIEW) ||
      roleKey === 'INGENIERO' ||
      roleKey === 'SUPERADMIN';

    const isOwner = submission.enrollment && submission.enrollment.userId === userId;

    if (!isReviewer && !isOwner) {
      throw new ForbiddenException('No tienes autorización para acceder o descargar esta entrega.');
    }

    let filePath = path.join(this.uploadDir, submission.fileUrl);

    // Si el archivo físico no existe (ej. semilla o demo), generar un documento de evidencia
    if (!fs.existsSync(filePath)) {
      filePath = this.generateSampleEvidenceFile(submission);
    }

    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'application/octet-stream';
    if (ext === '.pdf') mimeType = 'application/pdf';
    else if (ext === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (ext === '.xlsx') mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    const safeTitle = submission.documentTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeStudent = submission.enrollment?.user?.fullName
      ? `_${submission.enrollment.user.fullName.replace(/[^a-zA-Z0-9_-]/g, '_')}`
      : '';
    const filename = `${safeTitle}${safeStudent}${ext || '.pdf'}`;

    return {
      filePath,
      filename,
      mimeType,
    };
  }

  private generateSampleEvidenceFile(submission: DocumentSubmission): string {
    const ext = submission.fileUrl.endsWith('.docx')
      ? '.docx'
      : submission.fileUrl.endsWith('.xlsx')
      ? '.xlsx'
      : '.pdf';

    const filename = `${submission.id}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      const studentName = submission.enrollment?.user?.fullName || 'Estudiante';
      const studentId = submission.enrollment?.user?.identification || 'N/A';
      const content = `DOCUMENTO DE EVIDENCIA ESTUDIANTIL
Título: ${submission.documentTitle}
Estudiante: ${studentName} (Cédula: ${studentId})
Estado: ${submission.status.toUpperCase()}
Fecha de Carga: ${submission.createdAt ? submission.createdAt.toISOString() : new Date().toISOString()}

Este archivo fue registrado en la plataforma institucional del Ing. Wilfrido Trujillo para revisión y auditoría documental.
`;
      fs.writeFileSync(filePath, content, 'utf8');
      submission.fileUrl = filename;
      this.submissionRepository.save(submission).catch(() => {});
    }

    return filePath;
  }
}
