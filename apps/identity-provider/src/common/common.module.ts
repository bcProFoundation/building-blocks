import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { redisClient } from './redis-microservice.client';
import { CommonCommandHandlers } from './commands';
import { CommonSagas } from './sagas';

@Module({
  imports: [ClientsModule.registerAsync([redisClient])],
  providers: [...CommonCommandHandlers, ...CommonSagas],
  exports: [ClientsModule.registerAsync([redisClient])],
})
export class CommonModule {}
