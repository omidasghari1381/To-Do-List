import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { User } from '../../users/user.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  async createTask(userId: number, dto: CreateTaskDto) {
    const task = this.taskRepo.create({ ...dto, user: { id: userId } });
    console.log(task);
    return await this.taskRepo.save(task);
  }

  async getTasks(userId: number) {
    return await this.taskRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
