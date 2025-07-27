import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './providers/tasks.service';
import { Task } from './task.entity';
import { User } from 'src/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
