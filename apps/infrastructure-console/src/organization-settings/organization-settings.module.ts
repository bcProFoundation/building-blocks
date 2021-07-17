import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BrandController } from './controllers/brand/brand.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { OrganizationSettingsAggregates } from './aggregates';
import { OrganizationSettingsCommandHandlers } from './commands';
import { OrganizationSettingsQueryHandlers } from './queries';
import { OrganizationSettingsEventHandlers } from './events';
import { BrandSettingsEntitiesModule } from './entities/entities.module';

@Module({
  imports: [CqrsModule, HttpModule, BrandSettingsEntitiesModule],
  controllers: [BrandController],
  providers: [
    ...OrganizationSettingsAggregates,
    ...OrganizationSettingsCommandHandlers,
    ...OrganizationSettingsQueryHandlers,
    ...OrganizationSettingsEventHandlers,
  ],
})
export class OrganizationSettingsModule {}
