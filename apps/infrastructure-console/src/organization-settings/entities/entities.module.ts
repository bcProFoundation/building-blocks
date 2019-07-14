import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandSettingsService } from './brand-settings/brand-settings.service';
import { BrandSettings } from './brand-settings/brand-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrandSettings])],
  providers: [BrandSettingsService],
  exports: [BrandSettingsService],
})
export class BrandSettingsEntitiesModule {}
