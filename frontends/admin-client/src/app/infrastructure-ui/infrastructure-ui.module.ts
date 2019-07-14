import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedImportsModule } from '../shared-imports/shared-imports.module';
import { ServiceComponent } from './service/service.component';
import { ServiceTypeComponent } from './service-type/service-type.component';
import { ServiceTypeService } from './service-type/service-type.service';
import { ServiceService } from './service/service.service';
import { InfrastructureSettingsComponent } from './infrastructure-settings/infrastructure-settings.component';
import { InfrastructureSettingsService } from './infrastructure-settings/infrastructure-settings.service';
import { BrandSettingsComponent } from './brand-settings/brand-settings.component';
import { BrandSettingsService } from './brand-settings/brand-settings.service';

@NgModule({
  declarations: [
    ServiceComponent,
    ServiceTypeComponent,
    InfrastructureSettingsComponent,
    BrandSettingsComponent,
  ],
  imports: [CommonModule, SharedImportsModule],
  exports: [
    ServiceComponent,
    ServiceTypeComponent,
    InfrastructureSettingsComponent,
    BrandSettingsComponent,
  ],
  providers: [
    ServiceService,
    ServiceTypeService,
    InfrastructureSettingsService,
    BrandSettingsService,
  ],
})
export class InfrastructureUIModule {}
