import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { WorkspaceEnrollment } from './workspace-enrollment.entity.js';
import type { ResourceFile } from '../../resources/entities/resource-file.entity.js';
import type { Test } from '../../tests/entities/test.entity.js';

export enum WorkspaceType {
  PRACTICAS = 'PRACTICAS',
  VINCULACION = 'VINCULACION',
  EVENTO = 'EVENTO',
}

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    default: WorkspaceType.PRACTICAS,
  })
  type!: WorkspaceType;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ unique: true })
  accessCode!: string;

  @Column({ type: 'text', nullable: true })
  inductionVideoUrl!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany('WorkspaceEnrollment', (enrollment: WorkspaceEnrollment) => enrollment.workspace)
  enrollments!: Relation<WorkspaceEnrollment[]>;

  @OneToMany('ResourceFile', (resource: ResourceFile) => resource.workspace)
  resources!: Relation<ResourceFile[]>;

  @OneToMany('Test', (test: Test) => test.workspace)
  tests!: Relation<Test[]>;
}
