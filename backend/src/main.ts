import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const corsOriginsRaw = configService.get<string>('CORS_ORIGIN', 'http://localhost:5173');
  const corsOrigins = corsOriginsRaw.split(',').map((origin) => origin.trim());

  // CORS restrictivo y seguro
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Prefijo global de API REST
  app.setGlobalPrefix('api');

  // Filtro global de excepciones normalizado a RFC 7807
  app.useGlobalFilters(new HttpExceptionFilter());

  // Pipe global de validación defensiva y saneamiento de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);
  logger.log(`Servidor NestJS escuchando en http://localhost:${port}/api`);
  logger.log(`CORS habilitado para orígenes: ${corsOrigins.join(', ')}`);
}

await bootstrap();
