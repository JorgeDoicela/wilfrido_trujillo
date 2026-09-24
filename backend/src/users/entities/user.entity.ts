import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { WorkspaceEnrollment } from '../../workspaces/entities/workspace-enrollment.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  identification!: string;

  @Column()
  fullName!: string;

  @Column({ default: 'ESTUDIANTE' })
  roleKey!: string;

  @Column({ type: 'simple-json', nullable: true })
  permissionsJson!: string[] | null;

  @Column()
  passwordHash!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany('WorkspaceEnrollment', (enrollment: WorkspaceEnrollment) => enrollment.user)
  enrollments!: Relation<WorkspaceEnrollment[]>;
}
