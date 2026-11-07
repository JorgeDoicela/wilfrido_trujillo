import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3010);
  const corsOriginsRaw = configService.get<string>('CORS_ORIGIN', 'http://localhost:5180');
  const corsOrigins = corsOriginsRaw.split(',').map((origin) => origin.trim());

  // Garantizar que el origen del frontend (APP_URL) esté permitido en CORS
  const appUrl = configService.get<string>('APP_URL', 'http://localhost:5180');
  if (appUrl && !corsOrigins.includes(appUrl)) {
    corsOrigins.push(appUrl);
  }

  // Validación defensiva de secreto JWT para despliegues de producción
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const jwtSecret = configService.get<string>('JWT_SECRET');
  if (isProduction && (!jwtSecret || jwtSecret.length < 32 || jwtSecret.includes('super_secret'))) {
    throw new Error('Configuración insegura: En entorno de producción JWT_SECRET debe tener al menos 32 caracteres y no usar claves por defecto.');
  }

  // CORS restrictivo y seguro
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Deshabilitar cabecera descriptiva X-Powered-By por seguridad
  const expressApp = app.getHttpAdapter().getInstance();
  if (expressApp && typeof expressApp.disable === 'function') {
    expressApp.disable('x-powered-by');
  }

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
