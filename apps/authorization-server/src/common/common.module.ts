import { Module, Global, HttpModule } from '@nestjs/common';
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
  exports: [
    CryptographerService,
    ...databaseProviders,
    HttpModule,
    ClientsModule.registerAsync([eventsClient]),
  ],
})
export class CommonModule {}
