import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['low', 'medium', 'high'])
  priority: 'low' | 'medium' | 'high';
}
