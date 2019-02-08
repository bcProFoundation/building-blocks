import { Module, Global } from '@nestjs/common';
import { ClientService } from './entities/client/client.service';
import { ScopeService } from './entities/scope/scope.service';
import { ClientController } from './controllers/client/client.controller';
import { ScopeController } from './controllers/scope/scope.controller';
import { ClientManagementEntitiesModule } from './entities/entities.module';

@Global()
@Module({
  providers: [ClientService, ScopeService],
  controllers: [ClientController, ScopeController],
  imports: [ClientManagementEntitiesModule],
  exports: [ClientService, ScopeService, ClientManagementEntitiesModule],
})
export class ClientManagementModule {}
