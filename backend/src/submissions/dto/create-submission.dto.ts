import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSubmissionDto {
  @IsNotEmpty({ message: 'El ID del espacio de trabajo es obligatorio.' })
  @IsString({ message: 'El ID del espacio de trabajo debe ser una cadena.' })
  workspaceId!: string;

  @IsNotEmpty({ message: 'El título del documento de entrega es obligatorio.' })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  documentTitle!: string;

  @IsOptional()
  @IsString({ message: 'La URL o ruta relativa del archivo.' })
  fileUrl?: string;
}
