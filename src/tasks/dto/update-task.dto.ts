import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { taskPriority } from '../enums/taskPriority.enum';
import { taskStatus } from '../enums/taskStatus.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(taskPriority)
  priority?: taskPriority;

  @IsOptional()
  @IsEnum(taskStatus)
  status?: taskStatus;
}
