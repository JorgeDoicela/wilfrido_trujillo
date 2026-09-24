import {
  IsString,
  MinLength,
  IsNumber,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTestQuestionDto {
  @IsString()
  id!: string;

  @IsString()
  @MinLength(5, { message: 'La pregunta debe tener al menos 5 caracteres.' })
  question!: string;

  @IsArray()
  @IsString({ each: true })
  options!: string[];

  @IsNumber()
  @Min(0)
  correctOptionIndex!: number;
}

export class CreateTestDto {
  @IsString()
  workspaceId!: string;

  @IsString()
  @MinLength(3, { message: 'El título del cuestionario debe tener al menos 3 caracteres.' })
  title!: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  passingScore?: number = 7;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTestQuestionDto)
  questions!: CreateTestQuestionDto[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  timeLimitMinutes?: number;
}

export class SubmitTestAnswersDto {
  @IsObject({ message: 'Las respuestas deben ser un objeto clave-valor con id de pregunta y opción.' })
  answers!: Record<string, number>;
}
