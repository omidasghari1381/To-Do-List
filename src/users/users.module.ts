import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
