import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailComponent } from './email/email.component';
import { CloudStorageComponent } from './cloud-storage/cloud-storage.component';
import { CloudStorageService } from './cloud-storage/cloud-storage.service';
import { EmailService } from './email/email.service';
import { SharedImportsModule } from '../shared-imports/shared-imports.module';

@NgModule({
  declarations: [EmailComponent, CloudStorageComponent],
  imports: [CommonModule, SharedImportsModule],
  exports: [EmailComponent, CloudStorageComponent],
  providers: [EmailService, CloudStorageService],
})
export class CommunicationUIModule {}
