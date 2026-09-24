import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity.js';
import { Workspace } from '../workspaces/entities/workspace.entity.js';
import { WorkspaceEnrollment } from '../workspaces/entities/workspace-enrollment.entity.js';
import { ResourceFile } from '../resources/entities/resource-file.entity.js';
import { Test } from '../tests/entities/test.entity.js';
import { TestAttempt } from '../tests/entities/test-attempt.entity.js';
import { DocumentSubmission } from '../submissions/entities/document-submission.entity.js';
import { Certificate } from '../certificates/entities/certificate.entity.js';
import { EventFeedback } from '../events/entities/event-feedback.entity.js';

const logger = new Logger('DatabaseModule');

export const ENTITIES = [
  User,
  Workspace,
  WorkspaceEnrollment,
  ResourceFile,
  Test,
  TestAttempt,
  DocumentSubmission,
  Certificate,
  EventFeedback,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databasePath = configService.get<string>('DATABASE_PATH', './data/wilfrido.sqlite');
        const isDevelopment = configService.get<string>('NODE_ENV') !== 'production';

        return {
          type: 'better-sqlite3',
          database: databasePath,
          entities: ENTITIES,
          synchronize: isDevelopment,
          prepareDatabase: (db: { pragma: (stmt: string) => unknown }) => {
            const journalMode = db.pragma('journal_mode = WAL');
            db.pragma('foreign_keys = ON');
            logger.log(
              `SQLite inicializado en ${databasePath} | journal_mode: ${JSON.stringify(journalMode)} | foreign_keys: ON`,
            );
          },
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
