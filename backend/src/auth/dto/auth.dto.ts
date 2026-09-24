import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido.' })
  email!: string;

  @IsString({ message: 'La identificación debe ser una cadena de texto válida.' })
  @MinLength(5, { message: 'La identificación debe tener al menos 5 caracteres.' })
  identification!: string;

  @IsString({ message: 'El nombre completo es requerido.' })
  @MinLength(3, { message: 'El nombre completo debe tener al menos 3 caracteres.' })
  fullName!: string;

  @IsString({ message: 'La contraseña es requerida.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password!: string;

  @IsOptional()
  @IsString()
  roleKey?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export class LoginDto {
  @IsString({ message: 'Debe ingresar su correo electrónico o número de cédula/identificación.' })
  identificationOrEmail!: string;

  @IsString({ message: 'La contraseña es requerida.' })
  password!: string;
}
