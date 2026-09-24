import { IsNotEmpty, IsString, IsEmail, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventFeedbackDto {
  @IsNotEmpty({ message: 'El nombre completo del asistente es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  attendeeName!: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'El formato de correo electrónico no es válido.' })
  attendeeEmail!: string;

  @IsOptional()
  @IsString({ message: 'El número de cédula debe ser texto.' })
  attendeeIdentification?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La calificación general debe ser un número entero.' })
  @Min(1, { message: 'La calificación mínima es 1 estrella.' })
  @Max(5, { message: 'La calificación máxima es 5 estrellas.' })
  rating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La claridad debe ser un número entero.' })
  @Min(1)
  @Max(5)
  clarityRating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La aplicabilidad debe ser un número entero.' })
  @Min(1)
  @Max(5)
  applicableRating?: number;

  @IsOptional()
  @IsString({ message: 'Los comentarios deben ser texto.' })
  comments?: string;
}
