import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { Workspace } from '../../workspaces/entities/workspace.entity.js';

@Entity('event_feedbacks')
export class EventFeedback {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  workspaceId!: string;

  @Column()
  attendeeName!: string;

  @Column()
  attendeeEmail!: string;

  @Column({ nullable: true })
  attendeeIdentification!: string;

  @Column({ type: 'int', default: 5 })
  rating!: number;

  @Column({ type: 'int', default: 5 })
  clarityRating!: number;

  @Column({ type: 'int', default: 5 })
  applicableRating!: number;

  @Column({ type: 'text', nullable: true })
  comments!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne('Workspace', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace!: Relation<Workspace>;
}
