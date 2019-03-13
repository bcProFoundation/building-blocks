import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ProfileManagementEntitiesModule } from './entities/profile-management-entities.module';
import { ProfileController } from './controllers/profile/profile.controller';
import { ProfileAggregate } from './aggregates';
import { UploadAvatarMetaDataService } from './policies/upload-avatar-meta-data/upload-avatar-meta-data.service';
import { ProfileManagementCommandHandlers } from './commands';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { ModuleRef } from '@nestjs/core';
import { ProfileManagementEventHandlers } from './events';

@Global()
@Module({
  imports: [ProfileManagementEntitiesModule, CQRSModule],
  exports: [ProfileManagementEntitiesModule],
  controllers: [ProfileController],
  providers: [
    ...ProfileAggregate,
    UploadAvatarMetaDataService,
    ...ProfileManagementCommandHandlers,
    ...ProfileManagementEventHandlers,
  ],
})
export class ProfileManagementModule implements OnModuleInit {
  constructor(
    private readonly command: CommandBus,
    private readonly moduleRef: ModuleRef,
    private readonly event: EventBus,
  ) {}

  onModuleInit() {
    this.command.setModuleRef(this.moduleRef);
    this.event.setModuleRef(this.moduleRef);
    this.command.register(ProfileManagementCommandHandlers);
    this.event.register(ProfileManagementEventHandlers);
  }
}
