import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import type { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { User } from '../users/entities/user.entity.js';
import { Permission } from './enums/permission.enum.js';

describe('AuthService (Seguridad y PBAC)', () => {
  let authService: AuthService;
  let userRepository: Partial<Repository<User>>;
  let jwtService: Partial<JwtService>;

  beforeEach(() => {
    userRepository = {
      findOne: vi.fn(),
      create: vi.fn().mockImplementation((dto) => ({ id: 'mock-user-id', ...dto })),
      save: vi.fn().mockImplementation(async (user) => user),
    };

    jwtService = {
      sign: vi.fn().mockReturnValue('mock_jwt_token_2026'),
    };

    authService = new AuthService(
      userRepository as Repository<User>,
      jwtService as JwtService,
    );
  });

  it('debe registrar usuarios públicos estrictamente con rol ESTUDIANTE y permisos de estudiante', async () => {
    vi.mocked(userRepository.findOne!).mockResolvedValue(null);

    const result = await authService.register({
      email: 'alumno@unach.edu.ec',
      identification: '0601234567',
      fullName: 'Alumno Prueba',
      password: 'Password123*',
    });

    expect(result.accessToken).toBe('mock_jwt_token_2026');
    expect(result.user.roleKey).toBe('ESTUDIANTE');
    expect(result.user.permissions).toContain(Permission.WORKSPACE_READ);
    expect(result.user.permissions).toContain(Permission.DOCUMENT_SUBMIT);
    expect(result.user.permissions).not.toContain(Permission.DOCUMENT_REVIEW);
    expect(result.user.permissions).not.toContain(Permission.WORKSPACE_MANAGE);
  });

  it('debe rechazar registro con correo o cédula duplicada lanzando ConflictException', async () => {
    vi.mocked(userRepository.findOne!).mockResolvedValue({
      id: 'existing-id',
      email: 'alumno@unach.edu.ec',
      identification: '0601234567',
    } as User);

    await expect(
      authService.register({
        email: 'alumno@unach.edu.ec',
        identification: '0601234567',
        fullName: 'Alumno Duplicado',
        password: 'Password123*',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('debe autenticar exitosamente a un usuario con contraseña válida', async () => {
    const passwordHash = await bcrypt.hash('Secret123*', 10);
    vi.mocked(userRepository.findOne!).mockResolvedValue({
      id: 'user-1',
      email: 'docente@unach.edu.ec',
      identification: '0600000001',
      fullName: 'Docente Prueba',
      roleKey: 'INGENIERO',
      permissionsJson: [Permission.WORKSPACE_MANAGE, Permission.DOCUMENT_REVIEW],
      passwordHash,
    } as User);

    const result = await authService.login({
      identificationOrEmail: '0600000001',
      password: 'Secret123*',
    });

    expect(result.accessToken).toBe('mock_jwt_token_2026');
    expect(result.user.fullName).toBe('Docente Prueba');
    expect(result.user.roleKey).toBe('INGENIERO');
  });

  it('debe rechazar autenticación ante contraseña incorrecta lanzando UnauthorizedException', async () => {
    const passwordHash = await bcrypt.hash('SecretCorrecta123*', 10);
    vi.mocked(userRepository.findOne!).mockResolvedValue({
      id: 'user-1',
      email: 'docente@unach.edu.ec',
      identification: '0600000001',
      passwordHash,
    } as User);

    await expect(
      authService.login({
        identificationOrEmail: '0600000001',
        password: 'PasswordEquivocada*',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('debe mitigar ataques de tiempo rechazando usuarios inexistentes de forma segura', async () => {
    vi.mocked(userRepository.findOne!).mockResolvedValue(null);

    await expect(
      authService.login({
        identificationOrEmail: 'usuario_fantasma',
        password: 'PasswordCualquiera*',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});

