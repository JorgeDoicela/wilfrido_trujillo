import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { WorkspaceEnrollment } from '../../workspaces/entities/workspace-enrollment.entity.js';
import type { Test } from './test.entity.js';

@Entity('test_attempts')
export class TestAttempt {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  enrollmentId!: string;

  @Column()
  testId!: string;

  @Column({ type: 'float' })
  scoreObtained!: number;

  @Column({ default: false })
  passed!: boolean;

  @Column({ type: 'simple-json' })
  answersSubmitted!: Record<string, number>;

  @Column({ type: 'datetime', nullable: true })
  completedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne('WorkspaceEnrollment', (enrollment: WorkspaceEnrollment) => enrollment.testAttempts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'enrollmentId' })
  enrollment!: Relation<WorkspaceEnrollment>;

  @ManyToOne('Test', (test: Test) => test.attempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'testId' })
  test!: Relation<Test>;
}
