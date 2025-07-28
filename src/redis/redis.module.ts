import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  providers: [RedisService],
  exports: [RedisService], // ✅ تا بقیه بتونن استفاده کنن
})
export class RedisModule {}