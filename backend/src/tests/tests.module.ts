import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './entities/test.entity.js';
import { TestAttempt } from './entities/test-attempt.entity.js';
import { WorkspaceEnrollment } from '../workspaces/entities/workspace-enrollment.entity.js';
import { Workspace } from '../workspaces/entities/workspace.entity.js';
import { TestsService } from './tests.service.js';
import { TestsController } from './tests.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Test, TestAttempt, WorkspaceEnrollment, Workspace]),
    AuthModule,
  ],
  controllers: [TestsController],
  providers: [TestsService],
  exports: [TestsService],
})
export class TestsModule {}
