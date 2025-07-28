import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { User } from '../../users/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    private redisService: RedisService,
  ) {}

  async createTask(userId: number, dto: CreateTaskDto) {
    const task = this.taskRepo.create({ ...dto, user: { id: userId } });
    console.log(task);
    return await this.taskRepo.save(task);
  }

  async getTasks(user: any) {
    const cacheKey = `tasks:user:${user.userId}`;

    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      console.log('📦 از کش');
      return cached;
    }

    const tasks = await this.taskRepo.find({
      where: { user: { id: user.userId } },
      order: { createdAt: 'DESC' },
    });

    await this.redisService.set(cacheKey, tasks, 60); // ← TTL = 60s
    console.log('🗄 از دیتابیس');
    return tasks;
  }
  async updateTask(userId: number, taskId: number, dto: UpdateTaskDto) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId, user: { id: userId } },
    });

    if (!task) throw new Error('Task not found or unauthorized');

    Object.assign(task, dto);
    const updated = await this.taskRepo.save(task);

    await this.redisService.del(`tasks:user:${userId}`);
    return updated;
  }

  async deleteTask(userId: number, taskId: number) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId, user: { id: userId } },
    });

    if (!task) throw new Error('Task not found or unauthorized');

    await this.taskRepo.remove(task);
    await this.redisService.del(`tasks:user:${userId}`);
    return { message: 'Task deleted successfully' };
  }
  async getTopTasks(user: any) {
  const cacheKey = `tasks:user:${user.userId}:top`;

  const cached = await this.redisService.get(cacheKey);
  if (cached) {
    console.log('📦 top از کش');
    return cached;
  }

  const tasks = await this.taskRepo.find({
    where: {
      user: { id: user.userId },
      priority: 'high',
    },
    order: { createdAt: 'DESC' },
    take: 5,
  });

  await this.redisService.set(cacheKey, tasks, 60);
  console.log('🗄 top از دیتابیس');
  return tasks;
}
}
