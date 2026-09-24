import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { WorkspacesModule } from './workspaces/workspaces.module.js';
import { TestsModule } from './tests/tests.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    WorkspacesModule,
    TestsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
