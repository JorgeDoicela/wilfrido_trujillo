import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { Workspace } from '../../workspaces/entities/workspace.entity.js';
import type { TestAttempt } from './test-attempt.entity.js';

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

@Entity('tests')
export class Test {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  workspaceId!: string;

  @Column()
  title!: string;

  @Column({ type: 'integer', default: 7 })
  passingScore!: number;

  @Column({ type: 'simple-json' })
  questions!: TestQuestion[];

  @Column({ type: 'integer', nullable: true })
  timeLimitMinutes!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne('Workspace', (workspace: Workspace) => workspace.tests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace!: Relation<Workspace>;

  @OneToMany('TestAttempt', (attempt: TestAttempt) => attempt.test)
  attempts!: Relation<TestAttempt[]>;
}
