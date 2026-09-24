import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventFeedback } from './entities/event-feedback.entity.js';
import { Workspace } from '../workspaces/entities/workspace.entity.js';
import { ResourceFile } from '../resources/entities/resource-file.entity.js';
import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventFeedback,
      Workspace,
      ResourceFile,
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
