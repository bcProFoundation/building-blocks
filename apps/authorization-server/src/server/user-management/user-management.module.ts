import { Module, Global } from '@nestjs/common';
import { UserManagementEntitiesModule } from './entities/entities.module';
import { UserManagementService } from './aggregates/user-management/user-management.service';
import { UserController } from './controllers/user/user.controller';
import { RoleController } from './controllers/role/role.controller';
import { UserDeleteRequestService } from './scheduler/user-delete-request.service';
import { UserAggregateService } from './aggregates/user-aggregate/user-aggregate.service';

@Global()
@Module({
  providers: [
    UserManagementService,
    UserDeleteRequestService,
    UserAggregateService,
  ],
  controllers: [UserController, RoleController],
  imports: [UserManagementEntitiesModule],
  exports: [
    UserManagementEntitiesModule,
    UserManagementService,
    UserAggregateService,
  ],
})
export class UserManagementModule {}
