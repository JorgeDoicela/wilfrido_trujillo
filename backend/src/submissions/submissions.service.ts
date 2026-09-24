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
    if (file) {
      fileUrl = file.filename;
    } else if (!fileUrl) {
      throw new BadRequestException('Debes adjuntar un archivo digital para tu entrega.');
    }

    const submission = this.submissionRepository.create({
      enrollmentId: enrollment.id,
      documentTitle: createDto.documentTitle.trim(),
      fileUrl,
      status: SubmissionStatus.SUBMITTED,
      feedbackNotes: null,
      auditedAt: null,
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
