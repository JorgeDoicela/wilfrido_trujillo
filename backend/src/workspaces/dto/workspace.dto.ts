import {
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { WorkspaceType } from '../entities/workspace.entity.js';

export class CreateWorkspaceDto {
  @IsString({ message: 'El título del espacio es requerido.' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres.' })
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(WorkspaceType, {
    message: 'El tipo debe ser PRACTICAS, VINCULACION o EVENTO.',
  })
  type!: WorkspaceType;

  @IsOptional()
  @IsString()
  @MinLength(4, { message: 'El código de acceso debe tener al menos 4 caracteres.' })
  accessCode?: string;
}

export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
