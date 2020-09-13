import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { eventsClient } from './events-microservice.client';
import { CommonCommandHandlers } from './commands';
import { CommonSagas } from './sagas';

@Module({
  imports: [ClientsModule.registerAsync([eventsClient])],
  providers: [...CommonCommandHandlers, ...CommonSagas],
  exports: [ClientsModule.registerAsync([eventsClient])],
})
export class CommonModule {}
