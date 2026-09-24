import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace, WorkspaceType } from './entities/workspace.entity.js';
import { WorkspaceEnrollment, EnrollmentStatus } from './entities/workspace-enrollment.entity.js';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dto/workspace.dto.js';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceEnrollment)
    private readonly enrollmentRepository: Repository<WorkspaceEnrollment>,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {
    let accessCode = createWorkspaceDto.accessCode?.trim().toUpperCase();

    if (!accessCode) {
      accessCode = this.generateAccessCode(createWorkspaceDto.type);
    }

    // Verificar si el código ya existe
    const existing = await this.workspaceRepository.findOne({
      where: { accessCode },
    });

    if (existing) {
      throw new ConflictException(
        `El código de acceso "${accessCode}" ya se encuentra registrado. Utilice uno diferente.`,
      );
    }

    const workspace = this.workspaceRepository.create({
      title: createWorkspaceDto.title.trim(),
      description: createWorkspaceDto.description?.trim() || null,
      type: createWorkspaceDto.type,
      accessCode,
      isActive: true,
    });

    return this.workspaceRepository.save(workspace);
  }

  async findAll(): Promise<Workspace[]> {
    return this.workspaceRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      relations: {
        resources: true,
        tests: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException(`Espacio de trabajo con ID "${id}" no encontrado.`);
    }

    return workspace;
  }

  async findByAccessCode(accessCode: string): Promise<Workspace> {
    const code = accessCode.trim().toUpperCase();
    const workspace = await this.workspaceRepository.findOne({
      where: { accessCode: code },
    });

    if (!workspace) {
      throw new NotFoundException(`No existe ningún espacio con el código de acceso "${code}".`);
    }

    return workspace;
  }

  async joinByAccessCode(
    accessCode: string,
    userId: string,
  ): Promise<{ enrollment: WorkspaceEnrollment; workspace: Workspace; isNew: boolean }> {
    const workspace = await this.findByAccessCode(accessCode);

    if (!workspace.isActive) {
      throw new BadRequestException('Este espacio de trabajo no se encuentra activo actualmente.');
    }

    // Comprobar si ya existe inscripción previa
    let enrollment = await this.enrollmentRepository.findOne({
      where: {
        userId,
        workspaceId: workspace.id,
      },
    });

    if (enrollment) {
      return { enrollment, workspace, isNew: false };
    }

    enrollment = this.enrollmentRepository.create({
      userId,
      workspaceId: workspace.id,
      status: EnrollmentStatus.ACTIVE,
      inductionVideoWatched: false,
      testPassed: false,
      testScore: null,
    });

    const savedEnrollment = await this.enrollmentRepository.save(enrollment);

    return {
      enrollment: savedEnrollment,
      workspace,
      isNew: true,
    };
  }

  async getUserEnrollments(userId: string): Promise<WorkspaceEnrollment[]> {
    return this.enrollmentRepository.find({
      where: { userId },
      relations: {
        workspace: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto): Promise<Workspace> {
    const workspace = await this.findOne(id);

    if (updateWorkspaceDto.title) {
      workspace.title = updateWorkspaceDto.title.trim();
    }
    if (updateWorkspaceDto.description !== undefined) {
      workspace.description = updateWorkspaceDto.description?.trim() || null;
    }
    if (updateWorkspaceDto.isActive !== undefined) {
      workspace.isActive = updateWorkspaceDto.isActive;
    }

    return this.workspaceRepository.save(workspace);
  }

  private generateAccessCode(type: WorkspaceType): string {
    const prefix =
      type === WorkspaceType.PRACTICAS
        ? 'PRAC'
        : type === WorkspaceType.VINCULACION
          ? 'VINC'
          : 'CONF';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomSuffix}`;
  }
}
