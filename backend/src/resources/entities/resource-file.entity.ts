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
import type { Workspace } from '../../workspaces/entities/workspace.entity.js';

@Entity('resource_files')
export class ResourceFile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  workspaceId!: string;

  @Column()
  title!: string;

  @Column()
  fileUrl!: string;

  @Column({ default: 'document' })
  fileType!: string;

  @Column({ default: false })
  isLockedUntilTestPass!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne('Workspace', (workspace: Workspace) => workspace.resources, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace!: Relation<Workspace>;
}
