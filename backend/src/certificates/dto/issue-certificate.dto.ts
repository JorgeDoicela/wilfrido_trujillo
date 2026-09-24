import { IsNotEmpty, IsString, IsEmail, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class IssueCertificateDto {
  @IsNotEmpty({ message: 'El ID del espacio de trabajo es obligatorio.' })
  @IsString({ message: 'El ID debe ser texto.' })
  workspaceId!: string;

  @IsNotEmpty({ message: 'El nombre del beneficiario es obligatorio.' })
  @IsString({ message: 'El nombre debe ser texto.' })
  recipientName!: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'El formato de correo no es válido.' })
  recipientEmail!: string;

  @IsOptional()
  @IsString({ message: 'La cédula o identificación debe ser texto.' })
  recipientIdentification?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Las horas deben ser un número entero.' })
  @Min(1, { message: 'Debe acreditar al menos 1 hora.' })
  hours?: number;
}
