import { Module, OnModuleInit } from '@nestjs/common';
import { CommandBus, EventBus, CQRSModule } from '@nestjs/cqrs';
import { ModuleRef } from '@nestjs/core';
import { CloudStorageEntitiesModule } from './entities/entities.module';
import { CloudStorageAggregates } from './aggregates';
import { CloudStorageControllers } from './controllers';
import { CloudStorageCommands } from './commands';
import { CloudStorageEvents } from './events';

@Module({
  imports: [CloudStorageEntitiesModule, CQRSModule],
  providers: [...CloudStorageAggregates],
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
