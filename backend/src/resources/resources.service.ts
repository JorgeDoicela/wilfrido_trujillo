import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ResourceFile } from './entities/resource-file.entity.js';
import { WorkspaceEnrollment } from '../workspaces/entities/workspace-enrollment.entity.js';
import { Workspace } from '../workspaces/entities/workspace.entity.js';
import { CreateResourceDto } from './dto/create-resource.dto.js';
import { Permission } from '../auth/enums/permission.enum.js';

export interface DownloadFileInfo {
  filePath: string;
  filename: string;
  mimeType: string;
}

@Injectable()
export class ResourcesService {
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads', 'resources');

  constructor(
    @InjectRepository(ResourceFile)
    private readonly resourceRepository: Repository<ResourceFile>,
    @InjectRepository(WorkspaceEnrollment)
    private readonly enrollmentRepository: Repository<WorkspaceEnrollment>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async findByWorkspace(workspaceId: string): Promise<ResourceFile[]> {
    const resources = await this.resourceRepository.find({
      where: { workspaceId },
      order: { createdAt: 'ASC' },
    });

    if (resources.length === 0) {
      return this.seedDefaultResources(workspaceId);
    }

    return resources;
  }

  async create(
    createDto: CreateResourceDto,
    file?: Express.Multer.File,
  ): Promise<ResourceFile> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: createDto.workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException(
        `Espacio de trabajo con ID "${createDto.workspaceId}" no encontrado.`,
      );
    }

    let fileUrl = createDto.fileUrl || '';
    let fileType = createDto.fileType || 'document';

    if (file) {
      fileUrl = file.filename;
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.pdf') fileType = 'pdf';
      else if (ext === '.doc' || ext === '.docx') fileType = 'word';
      else if (ext === '.xls' || ext === '.xlsx') fileType = 'excel';
      else fileType = 'document';
    }

    const resource = this.resourceRepository.create({
      workspaceId: createDto.workspaceId,
      title: createDto.title.trim(),
      fileUrl,
      fileType,
      isLockedUntilTestPass: createDto.isLockedUntilTestPass ?? false,
    });

    return this.resourceRepository.save(resource);
  }

  async getDownloadInfo(
    resourceId: string,
    userId: string,
    permissions: string[] = [],
    roleKey = '',
  ): Promise<DownloadFileInfo> {
    const resource = await this.resourceRepository.findOne({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new NotFoundException(`Recurso con ID "${resourceId}" no encontrado.`);
    }

    // Si el recurso está condicionado a la aprobación del examen
    if (resource.isLockedUntilTestPass) {
      const isTeacherOrAdmin =
        permissions.includes(Permission.RESOURCE_MANAGE) ||
        roleKey === 'INGENIERO' ||
        roleKey === 'SUPERADMIN';

      if (!isTeacherOrAdmin) {
        const enrollment = await this.enrollmentRepository.findOne({
          where: {
            workspaceId: resource.workspaceId,
            userId,
          },
        });

        if (!enrollment || !enrollment.testPassed) {
          throw new ForbiddenException(
            'Acceso denegado: Esta plantilla oficial está protegida. Debes completar y aprobar la evaluación de conocimientos con al menos el puntaje requerido antes de poder descargarla.',
          );
        }
      }
    }

    // Resolver ruta local en el disco
    let filePath = path.join(this.uploadDir, resource.fileUrl);

    // Si el archivo físico aún no existe (ej. semilla o demo), generar un documento de plantilla oficial
    if (!fs.existsSync(filePath)) {
      filePath = this.generateSampleTemplateFile(resource);
    }

    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'application/octet-stream';
    if (ext === '.pdf') mimeType = 'application/pdf';
    else if (ext === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (ext === '.xlsx') mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    const safeFilename = `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}${ext || '.pdf'}`;

    return {
      filePath,
      filename: safeFilename,
      mimeType,
    };
  }

  async remove(resourceId: string): Promise<{ success: boolean; message: string }> {
    const resource = await this.resourceRepository.findOne({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new NotFoundException(`Recurso con ID "${resourceId}" no encontrado.`);
    }

    const filePath = path.join(this.uploadDir, resource.fileUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // Ignorar error al borrar archivo físico
      }
    }

    await this.resourceRepository.remove(resource);
    return { success: true, message: 'Plantilla oficial eliminada correctamente.' };
  }

  private async seedDefaultResources(workspaceId: string): Promise<ResourceFile[]> {
    const defaultTemplates = [
      {
        workspaceId,
        title: 'Guía Oficial de Prácticas Preprofesionales y RRA',
        fileUrl: 'guia_oficial_practicas.pdf',
        fileType: 'pdf',
        isLockedUntilTestPass: false, // Guía libre para estudio previo
      },
      {
        workspaceId,
        title: 'Plan de Aprendizaje y Convenio Empresarial (Formato A1)',
        fileUrl: 'formato_a1_convenio_plan.docx',
        fileType: 'word',
        isLockedUntilTestPass: true, // Bloqueado hasta aprobar el test
      },
      {
        workspaceId,
        title: 'Bitácora Semanal de Horas y Control de Actividades (Formato B2)',
        fileUrl: 'formato_b2_bitacora_semanal.xlsx',
        fileType: 'excel',
        isLockedUntilTestPass: true, // Bloqueado hasta aprobar el test
      },
    ];

    const entities: ResourceFile[] = [];
    for (const item of defaultTemplates) {
      const created = this.resourceRepository.create(item);
      const saved = await this.resourceRepository.save(created);
      entities.push(saved);
      this.generateSampleTemplateFile(saved);
    }

    return entities;
  }

  private generateSampleTemplateFile(resource: ResourceFile): string {
    const ext =
      resource.fileType === 'pdf'
        ? '.pdf'
        : resource.fileType === 'excel'
        ? '.xlsx'
        : resource.fileType === 'word'
        ? '.docx'
        : '.pdf';

    const filename = `${resource.id}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      const content = `PLANTILLA OFICIAL - ING. WILFRIDO TRUJILLO
Documento: ${resource.title}
Tipo: ${resource.fileType.toUpperCase()}
Condición de Desbloqueo: ${resource.isLockedUntilTestPass ? 'Aprobación obligatoria de Test de Inducción' : 'Acceso Público'}
Generado: ${new Date().toISOString()}

Este documento constituye un formato oficial institucional validado por la Coordinación de Prácticas y Vinculación.
`;
      fs.writeFileSync(filePath, content, 'utf8');
      resource.fileUrl = filename;
      this.resourceRepository.save(resource).catch(() => {});
    }

    return filePath;
  }
}
