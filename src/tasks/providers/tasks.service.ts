import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
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
    const saved = await this.taskRepo.save(task);
    await this.redisService.del(`tasks:user:${userId}`);
    await this.redisService.del(`tasks:user:${userId}:top`);
    return saved;
  }

  async getTasks(user: any, filters: { status?: string; priority?: string }) {
    const userId = user.userId;
    const noFilters = !filters.status && !filters.priority;
    const cacheKey = `tasks:user:${userId}`;

    if (noFilters) {
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        console.log('from cache');
        return cached;
      }
    }

    const where: any = { user: { id: userId } };
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;

    const tasks = await this.taskRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });

    if (noFilters) await this.redisService.set(cacheKey, tasks, 60);
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
    await this.redisService.del(`tasks:user:${userId}:top`);

    return updated;
  }

  async deleteTask(userId: number, taskId: number) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId, user: { id: userId } },
    });

    if (!task) throw new Error('Task not found or unauthorized');

    await this.taskRepo.remove(task);
    await this.redisService.del(`tasks:user:${userId}`);
    await this.redisService.del(`tasks:user:${userId}:top`);
    return { message: 'Task deleted successfully' };
  }
  async getTopTasks(user: any) {
    const userId = user.userId;
    const cacheKey = `tasks:user:${userId}:top`;

    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      console.log('from cache');
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
    console.log('from database');
    return tasks;
  }
}
