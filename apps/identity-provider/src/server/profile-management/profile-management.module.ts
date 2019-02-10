import { Module, Global } from '@nestjs/common';
import { ProfileManagementEntitiesModule } from './entities/profile-management-entities.module';
import { ProfileController } from './controllers/profile/profile.controller';

@Global()
@Module({
  imports: [ProfileManagementEntitiesModule],
  exports: [ProfileManagementEntitiesModule],
  controllers: [ProfileController],
})
export class ProfileManagementModule {}
