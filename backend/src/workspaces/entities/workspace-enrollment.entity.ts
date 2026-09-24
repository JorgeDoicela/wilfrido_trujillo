import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { User } from '../../users/entities/user.entity.js';
import type { Workspace } from './workspace.entity.js';
import type { DocumentSubmission } from '../../submissions/entities/document-submission.entity.js';
import type { TestAttempt } from '../../tests/entities/test-attempt.entity.js';

export enum EnrollmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
}

@Entity('workspace_enrollments')
@Unique(['userId', 'workspaceId'])
export class WorkspaceEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  workspaceId!: string;

  @Column({ default: false })
  inductionVideoWatched!: boolean;

  @Column({ default: false })
  testPassed!: boolean;

  @Column({ type: 'float', nullable: true })
  testScore!: number | null;

  @Column({
    type: 'varchar',
    length: 50,
    default: EnrollmentStatus.ACTIVE,
  })
  status!: EnrollmentStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne('User', (user: User) => user.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: Relation<User>;

  @ManyToOne('Workspace', (workspace: Workspace) => workspace.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace!: Relation<Workspace>;

  @OneToMany('DocumentSubmission', (submission: DocumentSubmission) => submission.enrollment)
  submissions!: Relation<DocumentSubmission[]>;

  @OneToMany('TestAttempt', (attempt: TestAttempt) => attempt.enrollment)
  testAttempts!: Relation<TestAttempt[]>;
}
