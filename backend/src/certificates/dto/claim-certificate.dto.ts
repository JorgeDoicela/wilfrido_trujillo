import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class ClaimCertificateDto {
  @IsNotEmpty({ message: 'El nombre completo es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena.' })
  recipientName!: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'El formato de correo no es válido.' })
  recipientEmail!: string;

  @IsOptional()
  @IsString({ message: 'La cédula o identificación debe ser texto.' })
  recipientIdentification?: string;
}
