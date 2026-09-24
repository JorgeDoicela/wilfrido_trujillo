import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { WorkspaceEnrollment } from '../../workspaces/entities/workspace-enrollment.entity.js';

export enum SubmissionStatus {
  SUBMITTED = 'submitted',
  OBSERVED = 'observed',
  APPROVED = 'approved',
}

@Entity('document_submissions')
export class DocumentSubmission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  enrollmentId!: string;

  @Column()
  documentTitle!: string;

  @Column()
  fileUrl!: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: SubmissionStatus.SUBMITTED,
  })
  status!: SubmissionStatus;

  @Column({ type: 'text', nullable: true })
  feedbackNotes!: string | null;

  @Column({ type: 'datetime', nullable: true })
  auditedAt!: Date | null;

  @Column({ type: 'integer', nullable: true })
  auditScore!: number | null;

  @Column({ type: 'simple-json', nullable: true })
  auditResult!: Record<string, unknown> | null;

  @Column({ type: 'datetime', nullable: true })
  approvedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne('WorkspaceEnrollment', (enrollment: WorkspaceEnrollment) => enrollment.submissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'enrollmentId' })
  enrollment!: Relation<WorkspaceEnrollment>;
}
