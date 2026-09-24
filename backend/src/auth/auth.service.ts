import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity.js';
import { RegisterDto, LoginDto } from './dto/auth.dto.js';
import { Permission } from './enums/permission.enum.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: registerDto.email.toLowerCase().trim() },
        { identification: registerDto.identification.trim() },
      ],
    });

    if (existingUser) {
      if (existingUser.email === registerDto.email.toLowerCase().trim()) {
        throw new ConflictException('Ya existe un usuario registrado con este correo electrónico.');
      }
      throw new ConflictException('Ya existe un usuario registrado con esta identificación/cédula.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    // Permisos por defecto: si es ESTUDIANTE, capacidades de estudiante; si se pasan explícitos, se usan
    const defaultStudentPermissions: Permission[] = [
      Permission.WORKSPACE_READ,
      Permission.RESOURCE_DOWNLOAD,
      Permission.TEST_TAKE,
      Permission.DOCUMENT_SUBMIT,
      Permission.CERTIFICATE_CLAIM,
    ];

    const permissions =
      registerDto.permissions && registerDto.permissions.length > 0
        ? registerDto.permissions
        : (registerDto.roleKey === 'INGENIERO' || registerDto.roleKey === 'SUPERADMIN')
          ? Object.values(Permission)
          : defaultStudentPermissions;

    const user = this.userRepository.create({
      email: registerDto.email.toLowerCase().trim(),
      identification: registerDto.identification.trim(),
      fullName: registerDto.fullName.trim(),
      roleKey: registerDto.roleKey || 'ESTUDIANTE',
      permissionsJson: permissions,
      passwordHash,
    });

    const savedUser = await this.userRepository.save(user);

    return this.buildAuthResponse(savedUser);
  }

  async login(loginDto: LoginDto) {
    const identifier = loginDto.identificationOrEmail.trim();

    const user = await this.userRepository.findOne({
      where: [
        { email: identifier.toLowerCase() },
        { identification: identifier },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas. Verifique su usuario o contraseña.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas. Verifique su usuario o contraseña.');
    }

    return this.buildAuthResponse(user);
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return {
      id: user.id,
      email: user.email,
      identification: user.identification,
      fullName: user.fullName,
      roleKey: user.roleKey,
      permissions: user.permissionsJson || [],
      createdAt: user.createdAt,
    };
  }

  private buildAuthResponse(user: User) {
    const permissions = user.permissionsJson || [];

    const payload = {
      sub: user.id,
      email: user.email,
      identification: user.identification,
      fullName: user.fullName,
      roleKey: user.roleKey,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        identification: user.identification,
        fullName: user.fullName,
        roleKey: user.roleKey,
        permissions,
      },
    };
  }
}
