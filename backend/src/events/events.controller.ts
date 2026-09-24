import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service.js';
import { CreateEventFeedbackDto } from './dto/create-event-feedback.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/guards/permissions.guard.js';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator.js';
import { Permission } from '../auth/enums/permission.enum.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Ruta pública para asistentes (escaneo de QR)
  @Get('public/:code')
  @HttpCode(HttpStatus.OK)
  async getPublicEvent(@Param('code') code: string) {
    return this.eventsService.getPublicEventByCode(code);
  }

  // Envío público de encuesta rápida de satisfacción
  @Post('public/:code/feedback')
  @HttpCode(HttpStatus.CREATED)
  async submitFeedback(
    @Param('code') code: string,
    @Body() dto: CreateEventFeedbackDto,
  ) {
    return this.eventsService.submitFeedback(code, dto);
  }

  // Resumen de satisfacción protegido para el Ingeniero
  @Get(':workspaceId/feedback-summary')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.WORKSPACE_READ)
  @HttpCode(HttpStatus.OK)
  async getFeedbackSummary(@Param('workspaceId') workspaceId: string) {
    return this.eventsService.getFeedbackSummary(workspaceId);
  }
}
