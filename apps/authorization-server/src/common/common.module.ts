import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule } from '@nestjs/microservices';
import { CryptographerService } from './services/cryptographer/cryptographer.service';
import { databaseProviders } from './database.provider';
import { eventsClient } from './events-microservice.client';
import { CommonCommandHandlers } from './commands';
import { CommonSagas } from './sagas';

@Global()
@Module({
  imports: [HttpModule, ClientsModule.registerAsync([eventsClient])],
  providers: [
    CryptographerService,
    ...databaseProviders,
    ...CommonCommandHandlers,
    ...CommonSagas,
  ],
  exports: [CryptographerService, ...databaseProviders, HttpModule],
})
export class CommonModule {}
