import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateResourceDto {
  @IsNotEmpty({ message: 'El ID del espacio de trabajo es obligatorio.' })
  @IsString({ message: 'El ID del espacio de trabajo debe ser una cadena.' })
  workspaceId!: string;

  @IsNotEmpty({ message: 'El título del recurso o plantilla es obligatorio.' })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  title!: string;

  @IsOptional()
  @IsString({ message: 'El tipo de archivo debe ser texto (pdf, word, excel, document).' })
  fileType?: string;

  @IsOptional()
  @IsString({ message: 'La URL o ruta relativa del archivo.' })
  fileUrl?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'isLockedUntilTestPass debe ser booleano.' })
  isLockedUntilTestPass?: boolean;
}
