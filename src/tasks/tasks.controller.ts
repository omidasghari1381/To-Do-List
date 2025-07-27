import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './providers/tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post()
  create(@Req() req, @Body() body: CreateTaskDto) {
    return this.taskService.createTask(req.user.userId, body);
  }

  @Get()
  getAll(@Req() req) {
    return this.taskService.getTasks(req.user.userId);
  }
}
