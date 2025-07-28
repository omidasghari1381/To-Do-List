import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './providers/tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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
  @Patch(':id')
  updateTask(@Req() req, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.updateTask(req.user.userId, +id, dto);
  }
  @Delete(':id')
  deleteTask(@Req() req, @Param('id') id: string) {
    return this.taskService.deleteTask(req.user.userId, +id);
  }
}
