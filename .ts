@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    private redisService: RedisService, // ✅ این خط اضافه شد
  ) {}

  async createTask(userId: number, dto: CreateTaskDto) {
    const task = this.taskRepo.create({ ...dto, user: { id: userId } });
    await this.redisService.del(`tasks:user:${userId}`);
    return await this.taskRepo.save(task);
  }

  async getTasks(user: any) {
    const cacheKey = `tasks:user:${user.userId}`;

    const cached = await this.redisService.get(cacheKey); // ✅ حرف کوچک
    if (cached) {
      console.log('📦 از کش');
      return cached;
    }

    const tasks = await this.taskRepo.find({
      where: { user: { id: user.userId } },
      order: { createdAt: 'DESC' },
    });

    await this.redisService.set(cacheKey, tasks, 60);
    console.log('🗄 از دیتابیس');
    return tasks;
  }
}