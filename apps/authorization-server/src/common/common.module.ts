import { Module, Global, HttpModule } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CryptographerService } from './services/cryptographer/cryptographer.service';
import { databaseProviders } from './database.provider';
import { redisClient } from './redis-microservice.client';
import { CommonCommandHandlers } from './commands';
import { CommonSagas } from './sagas';

@Global()
@Module({
  imports: [HttpModule, ClientsModule.registerAsync([redisClient])],
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
    ClientsModule.registerAsync([redisClient]),
  ],
})
export class CommonModule {}
