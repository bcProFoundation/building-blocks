import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailComponent } from './email/email.component';
import { CloudStorageComponent } from './cloud-storage/cloud-storage.component';
import { CloudStorageService } from './cloud-storage/cloud-storage.service';
import { EmailService } from './email/email.service';
import { SharedImportsModule } from '../shared-imports/shared-imports.module';
import { CommunicationSettingsComponent } from './communication-settings/communication-settings.component';
import { OAuth2ProviderComponent } from './oauth2-provider/oauth2-provider.component';
import { OAuth2ProviderService } from './oauth2-provider/oauth2-provider.service';

@NgModule({
  declarations: [
    EmailComponent,
    CloudStorageComponent,
    CommunicationSettingsComponent,
    OAuth2ProviderComponent,
  ],
  imports: [CommonModule, SharedImportsModule],
  exports: [
    EmailComponent,
    CloudStorageComponent,
    CommunicationSettingsComponent,
  ],
  providers: [EmailService, CloudStorageService, OAuth2ProviderService],
})
export class CommunicationUIModule {}
