import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { taskPriority } from '../enums/taskPriority.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  @MinLength(4)
  @IsString()
  title: string;
  
  @IsOptional()
  @MinLength(12)
  @IsString()
  description?: string;
  
  @IsNotEmpty()
  @IsEnum(taskPriority)
  priority: taskPriority;
}
