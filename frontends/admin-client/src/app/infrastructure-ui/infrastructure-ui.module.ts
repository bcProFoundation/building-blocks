import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedImportsModule } from '../shared-imports/shared-imports.module';
import { ServiceComponent } from './service/service.component';
import { ServiceTypeComponent } from './service-type/service-type.component';
import { ServiceTypeService } from './service-type/service-type.service';
import { ServiceService } from './service/service.service';
import { InfrastructureSettingsComponent } from './infrastructure-settings/infrastructure-settings.component';
import { InfrastructureSettingsService } from './infrastructure-settings/infrastructure-settings.service';

@NgModule({
  declarations: [
    ServiceComponent,
    ServiceTypeComponent,
    InfrastructureSettingsComponent,
  ],
  imports: [CommonModule, SharedImportsModule],
  exports: [
    ServiceComponent,
    ServiceTypeComponent,
    InfrastructureSettingsComponent,
  ],
  providers: [
    ServiceService,
    ServiceTypeService,
    InfrastructureSettingsService,
  ],
})
export class InfrastructureUIModule {}
