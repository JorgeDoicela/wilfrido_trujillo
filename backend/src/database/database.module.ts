import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('DatabaseModule');

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
          autoLoadEntities: true,
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
