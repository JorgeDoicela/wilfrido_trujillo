---
name: wilfrido-backend
description: Directrices maestras de desarrollo backend para el proyecto wilfrido_trujillo (NestJS 11, SQLite WAL con better-sqlite3, TypeORM, PBAC, RFC 7807 y patrones desacoplados con DIP).
---

# Guía Técnica de Desarrollo Backend — Proyecto wilfrido_trujillo

Esta skill complementa la skill global `desarrollo-backend` con los estándares específicos del backend de `wilfrido_trujillo`.

---

## 1. Convenciones Mandatorias de Arquitectura

1. **Módulos ESM:**
   * El proyecto opera con `"type": "module"`.
   * En todas las importaciones relativas dentro de TypeScript, es mandatorio incluir la extensión `.js`:
     ```typescript
     // Correcto
     import { User } from '../users/entities/user.entity.js';
     import { Permission } from './enums/permission.enum.js';

     // Incorrecto (fallará al compilar)
     import { User } from '../users/entities/user.entity';
     ```
2. **Persistencia SQLite WAL con `better-sqlite3`:**
   * Toda nueva entidad relacional debe añadirse explícitamente al array `ENTITIES` en `backend/src/database/database.module.ts`.
   * Jamás alterar los pragmas `WAL` y `foreign_keys = ON` configurados en `prepareDatabase`.
   * Para estructuras complejas como bancos de preguntas, respuestas de evaluaciones o diagnósticos de auditoría, utilizar `@Column({ type: 'simple-json' })`.
3. **Control de Acceso Basado en Permisos (PBAC):**
   * Queda terminantemente prohibido condicionar métodos a roles con cadenas literales.
   * Todos los endpoints protegidos deben utilizar el decorador `@RequirePermissions(...)` especificando permisos del enum `Permission`.
   * Todo controlador protegido debe incluir los guards `@UseGuards(JwtAuthGuard, PermissionsGuard)`.
4. **Manejo de Errores RFC 7807:**
   * Utilizar las excepciones canónicas de NestJS (`NotFoundException`, `BadRequestException`, `ForbiddenException`, `ConflictException`, `UnauthorizedException`).
   * Nunca atrapar errores con `try-catch` para devolver objetos `{ success: false }` o strings genéricos; permitir que el `HttpExceptionFilter` formatee la respuesta.
5. **Inversión de Dependencias (DIP):**
   * Los servicios que dependan de motores intercambiables (como el auditor documental) deben inyectar la interfaz abstracta mediante su token:
     ```typescript
     @Inject(DOCUMENT_AUDITOR)
     private readonly documentAuditor: IDocumentAuditor
     ```

---

## 2. Comandos Operativos del Backend

| Comando | Acción |
| :--- | :--- |
| `pnpm --filter backend start:dev` | Inicia el backend en modo observador (`nest start --watch`). |
| `pnpm --filter backend build` | Compila la aplicación NestJS en `backend/dist/`. |
| `pnpm --filter backend run test` | Ejecuta las pruebas unitarias mediante Vitest. |
