import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { Workspace } from '../../workspaces/entities/workspace.entity.js';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  workspaceId!: string;

  @Column()
  recipientName!: string;

  @Column()
  recipientEmail!: string;

  @Column({ nullable: true })
  recipientIdentification!: string;

  @Column({ type: 'int', default: 40 })
  hours!: number;

  @Index({ unique: true })
  @Column({ unique: true })
  verificationHash!: string;

  @Column({ type: 'text', nullable: true })
  pdfPath!: string | null;

  @CreateDateColumn()
  issuedAt!: Date;

  @ManyToOne('Workspace', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace!: Relation<Workspace>;
}
