import { Module, Global } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CloudStorageEntitiesModule } from './entities/entities.module';
import { CloudStorageAggregates } from './aggregates';
import { CloudStorageControllers } from './controllers';
import { CloudStorageCommands } from './commands';
import { CloudStorageEvents } from './events';
import { ModifyCloudStorageAggregateService } from './aggregates/modify-cloud-storage-aggregate/modify-cloud-storage-aggregate.service';

@Global()
@Module({
  imports: [CloudStorageEntitiesModule, CqrsModule],
  providers: [
    ...CloudStorageAggregates,
    ...CloudStorageCommands,
    ...CloudStorageEvents,
    ModifyCloudStorageAggregateService,
  ],
  controllers: [...CloudStorageControllers],
  exports: [CloudStorageEntitiesModule, ...CloudStorageAggregates],
})
export class CloudStorageModule {}
