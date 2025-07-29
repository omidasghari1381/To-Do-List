import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { taskStatus } from './enums/taskStatus.enum';
import { taskPriority } from './enums/taskPriority.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'enum',
    enum: taskStatus,
    default: taskStatus.PENDING,
  })
  status: taskStatus;

  @Column({
    type: 'enum',
    enum: taskPriority,
    default: taskPriority.MEDIUM,
  })
  priority: taskPriority;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user: User;
}
