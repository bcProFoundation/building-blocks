import { Module, Global } from '@nestjs/common';
import { ProfileManagementEntitiesModule } from './entities/profile-management-entities.module';
import { ProfileController } from './controllers/profile/profile.controller';
import { ProfileAggregate } from './aggregates';
import { UploadAvatarMetaDataService } from './policies/upload-avatar-meta-data/upload-avatar-meta-data.service';
import { ProfileManagementCommandHandlers } from './commands';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileManagementEventHandlers } from './events';
import { ProfileManagementQueryHandlers } from './queries';

@Global()
@Module({
  imports: [ProfileManagementEntitiesModule, CqrsModule],
  exports: [ProfileManagementEntitiesModule],
  controllers: [ProfileController],
  providers: [
    ...ProfileAggregate,
    UploadAvatarMetaDataService,
    ...ProfileManagementCommandHandlers,
    ...ProfileManagementEventHandlers,
    ...ProfileManagementQueryHandlers,
  ],
})
export class ProfileManagementModule {}
