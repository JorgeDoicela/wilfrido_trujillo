import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventFeedback } from './entities/event-feedback.entity.js';
import { Workspace } from '../workspaces/entities/workspace.entity.js';
import { ResourceFile } from '../resources/entities/resource-file.entity.js';
import { CreateEventFeedbackDto } from './dto/create-event-feedback.dto.js';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventFeedback)
    private readonly feedbackRepository: Repository<EventFeedback>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(ResourceFile)
    private readonly resourceRepository: Repository<ResourceFile>,
  ) {}

  async getPublicEventByCode(accessCode: string) {
    const cleanCode = accessCode.trim().toUpperCase();

    const workspace = await this.workspaceRepository.findOne({
      where: { accessCode: cleanCode },
    });

    if (!workspace) {
      throw new NotFoundException(
        `No se encontró ningún evento o conferencia con el código "${cleanCode}".`,
      );
    }

    if (!workspace.isActive) {
      throw new BadRequestException('Este evento no se encuentra activo actualmente.');
    }

    // Obtener diapositivas y materiales adjuntos del evento
    const resources = await this.resourceRepository.find({
      where: { workspaceId: workspace.id },
      order: { createdAt: 'ASC' },
    });

    return {
      id: workspace.id,
      title: workspace.title,
      description: workspace.description,
      type: workspace.type,
      accessCode: workspace.accessCode,
      createdAt: workspace.createdAt,
      resources: resources.map((r) => ({
        id: r.id,
        title: r.title,
        fileType: r.fileType,
        isLocked: r.isLockedUntilTestPass,
        downloadUrl: `/api/resources/${r.id}/download`,
      })),
    };
  }

  async submitFeedback(accessCode: string, dto: CreateEventFeedbackDto) {
    const cleanCode = accessCode.trim().toUpperCase();
    const workspace = await this.workspaceRepository.findOne({
      where: { accessCode: cleanCode },
    });

    if (!workspace) {
      throw new NotFoundException(
        `Evento con código "${cleanCode}" no encontrado.`,
      );
    }

    const feedback = this.feedbackRepository.create({
      workspaceId: workspace.id,
      attendeeName: dto.attendeeName.trim(),
      attendeeEmail: dto.attendeeEmail.trim().toLowerCase(),
      attendeeIdentification: dto.attendeeIdentification ? dto.attendeeIdentification.trim() : '',
      rating: dto.rating ?? 5,
      clarityRating: dto.clarityRating ?? 5,
      applicableRating: dto.applicableRating ?? 5,
      comments: dto.comments ? dto.comments.trim() : null,
    });

    const saved = await this.feedbackRepository.save(feedback);

    return {
      success: true,
      message: '¡Gracias por tu participación! Tu asistencia y retroalimentación han sido registradas exitosamente.',
      feedbackId: saved.id,
      attendeeName: saved.attendeeName,
      eventTitle: workspace.title,
    };
  }

  async getFeedbackSummary(workspaceId: string) {
    const feedbacks = await this.feedbackRepository.find({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
    });

    const total = feedbacks.length;
    if (total === 0) {
      return {
        totalResponses: 0,
        averageRating: 5.0,
        averageClarity: 5.0,
        averageApplicable: 5.0,
        feedbacks: [],
      };
    }

    const sumRating = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    const sumClarity = feedbacks.reduce((acc, f) => acc + f.clarityRating, 0);
    const sumApplicable = feedbacks.reduce((acc, f) => acc + f.applicableRating, 0);

    return {
      totalResponses: total,
      averageRating: Math.round((sumRating / total) * 10) / 10,
      averageClarity: Math.round((sumClarity / total) * 10) / 10,
      averageApplicable: Math.round((sumApplicable / total) * 10) / 10,
      feedbacks: feedbacks.map((f) => ({
        id: f.id,
        attendeeName: f.attendeeName,
        rating: f.rating,
        clarityRating: f.clarityRating,
        applicableRating: f.applicableRating,
        comments: f.comments,
        createdAt: f.createdAt,
      })),
    };
  }
}
