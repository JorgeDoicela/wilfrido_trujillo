import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  OnApplicationBootstrap,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity.js';
import { RegisterDto, LoginDto } from './dto/auth.dto.js';
import { Permission } from './enums/permission.enum.js';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedInitialUsers();
  }

  private async seedInitialUsers() {
    const adminEmail = 'wilfrido.trujillo@unach.edu.ec';
    const existingAdmin = await this.userRepository.findOne({
      where: [{ email: adminEmail }, { identification: '0600000001' }],
    });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Admin123*', salt);
      const admin = this.userRepository.create({
        email: adminEmail,
        identification: '0600000001',
        fullName: 'Ing. Wilfrido Trujillo',
        roleKey: 'INGENIERO',
        permissionsJson: Object.values(Permission),
        passwordHash,
      });
      await this.userRepository.save(admin);
      this.logger.log('✅ Usuario Administrador Creado: wilfrido.trujillo@unach.edu.ec / 0600000001 (Clave: Admin123*)');
    }

    const studentEmail = 'estudiante@unach.edu.ec';
    const existingStudent = await this.userRepository.findOne({
      where: [{ email: studentEmail }, { identification: '0600000002' }],
    });

    if (!existingStudent) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Estudiante123*', salt);
      const student = this.userRepository.create({
        email: studentEmail,
        identification: '0600000002',
        fullName: 'Juan Pérez (Estudiante)',
        roleKey: 'ESTUDIANTE',
        permissionsJson: [
          Permission.WORKSPACE_READ,
          Permission.RESOURCE_DOWNLOAD,
          Permission.TEST_TAKE,
          Permission.DOCUMENT_SUBMIT,
          Permission.CERTIFICATE_CLAIM,
        ],
        passwordHash,
      });
      await this.userRepository.save(student);
      this.logger.log('✅ Usuario Estudiante Creado: estudiante@unach.edu.ec / 0600000002 (Clave: Estudiante123*)');
    }
  }

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
