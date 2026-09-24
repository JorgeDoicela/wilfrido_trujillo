import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentSubmission } from './entities/document-submission.entity.js';
import { WorkspaceEnrollment } from '../workspaces/entities/workspace-enrollment.entity.js';
import { Workspace } from '../workspaces/entities/workspace.entity.js';
import { SubmissionsController } from './submissions.controller.js';
import { SubmissionsService } from './submissions.service.js';
import { AuditorModule } from '../auditor/auditor.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentSubmission,
      WorkspaceEnrollment,
      Workspace,
    ]),
    AuditorModule,
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
