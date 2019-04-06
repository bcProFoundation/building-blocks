import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service/service.entity';
import { ServiceType } from './service-type/service-type.entity';
import { ServiceService } from './service/service.service';
import { ServiceTypeService } from './service-type/service-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceType])],
  providers: [ServiceService, ServiceTypeService],
  exports: [ServiceService, ServiceTypeService],
})
export class ServiceManagementEntitiesModule {}
