import { IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { SubmissionStatus } from '../entities/document-submission.entity.js';

export class ReviewSubmissionDto {
  @IsNotEmpty({ message: 'El estado de revisión es obligatorio.' })
  @IsEnum(SubmissionStatus, {
    message: 'El estado debe ser: submitted, observed o approved.',
  })
  status!: SubmissionStatus;

  @IsOptional()
  @IsString({ message: 'Las observaciones o feedback deben ser texto.' })
  feedbackNotes?: string;
}
