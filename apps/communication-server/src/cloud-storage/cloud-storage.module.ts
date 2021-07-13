import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CqrsModule } from '@nestjs/cqrs';
import { CloudStorageEntitiesModule } from './entities/entities.module';
import { CloudStorageAggregates } from './aggregates';
import { CloudStorageControllers } from './controllers';
import { CloudStorageCommands } from './commands';
import { CloudStorageEvents } from './events';
import { CloudStorageQueries } from './queries';

@Global()
@Module({
  imports: [CloudStorageEntitiesModule, CqrsModule, HttpModule],
  providers: [
    ...CloudStorageAggregates,
    ...CloudStorageCommands,
    ...CloudStorageEvents,
    ...CloudStorageQueries,
  ],
  controllers: [...CloudStorageControllers],
  exports: [CloudStorageEntitiesModule, ...CloudStorageAggregates],
})
export class CloudStorageModule {}
