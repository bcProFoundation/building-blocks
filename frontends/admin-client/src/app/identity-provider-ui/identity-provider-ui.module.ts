import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedImportsModule } from '../shared-imports/shared-imports.module';
import { IdpSettingsComponent } from './idp-settings/idp-settings.component';
import { IdpSettingsService } from './idp-settings/idp-settings.service';

@NgModule({
  declarations: [IdpSettingsComponent],
  imports: [CommonModule, SharedImportsModule],
  exports: [CommonModule, SharedImportsModule],
  providers: [IdpSettingsService],
})
export class IdentityProviderUIModule {}
