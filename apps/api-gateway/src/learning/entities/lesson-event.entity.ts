import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lesson_events')
export class LessonEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @Column()
  lessonId: string;

  @Column('float')
  score: number;

  @Column()
  timestamp: string;

  @Column({ nullable: true })
  correlationId?: string;

  @Column('simple-json', { nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  externalStatus?: string;

  @CreateDateColumn()
  createdAt: Date;
}
