import { Module, OnModuleInit, Global } from '@nestjs/common';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { ModuleRef } from '@nestjs/core';
import { CloudStorageEntitiesModule } from './entities/entities.module';
import { CloudStorageAggregates } from './aggregates';
import { CloudStorageControllers } from './controllers';
import { CloudStorageCommands } from './commands';
import { CloudStorageEvents } from './events';
import { ModifyCloudStorageAggregateService } from './aggregates/modify-cloud-storage-aggregate/modify-cloud-storage-aggregate.service';

@Global()
@Module({
  imports: [CloudStorageEntitiesModule, CQRSModule],
  providers: [
    ...CloudStorageAggregates,
    ...CloudStorageCommands,
    ...CloudStorageEvents,
    ModifyCloudStorageAggregateService,
  ],
  controllers: [...CloudStorageControllers],
  exports: [CloudStorageEntitiesModule, ...CloudStorageAggregates],
})
export class CloudStorageModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  onModuleInit() {
    this.commandBus.setModuleRef(this.moduleRef);
    this.eventBus.setModuleRef(this.moduleRef);
    this.commandBus.register(CloudStorageCommands);
    this.eventBus.register(CloudStorageEvents);
  }
}
