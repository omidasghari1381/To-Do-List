import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const existing = await this.userRepo.findOneBy({ email: data.email });
    if (existing) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepo.create({
      ...data,
      password: hashedPassword,
    });
    await this.userRepo.save(user);

    return { message: 'User registered successfully' };
  }

  async login(data: any) {
    const user = await this.userRepo.findOneBy({ email: data.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
