import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async getUsers(userId?: number) {
    if (userId) {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        select: ['id', 'username', 'email'],
      });
      return user;
    }
    const users = await this.userRepo.find({
      select: ['id', 'username', 'email'],
    });
    return users;
  }
}
