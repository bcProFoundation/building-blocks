import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from './settings.service';
import { CommunicationServerSettings } from '../interfaces/communication-server-settings.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  appURL: string;
  authServerURL: string;
  clientId: string;
  clientSecret: string;
  communicationServerSystemEmailAccount: string;
  emailAccounts: any[];
  hide: boolean = true;

  authSettingsForm = new FormGroup({
    appURL: new FormControl(this.appURL),
    authServerURL: new FormControl(this.authServerURL),
    clientId: new FormControl(this.clientId),
    clientSecret: new FormControl(this.clientSecret),
    communicationServerSystemEmailAccount: new FormControl(
      this.communicationServerSystemEmailAccount,
    ),
  });

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.getSettings().subscribe({
      next: (response: CommunicationServerSettings) => {
        this.appURL = response.appURL;
        this.authServerURL = response.authServerURL;
        this.clientId = response.clientId;
        this.clientSecret = response.clientSecret;
        (this.communicationServerSystemEmailAccount =
          response.communicationServerSystemEmailAccount),
          this.populateForm(response);
      },
    });
    this.settingsService.getEmailAccounts().subscribe({
      next: (response: any[]) => {
        this.emailAccounts = response;
      },
    });
  }

  populateForm(response) {
    this.authSettingsForm.controls.appURL.setValue(response.appURL);
    this.authSettingsForm.controls.authServerURL.setValue(
      response.authServerURL,
    );
    this.authSettingsForm.controls.clientId.setValue(response.clientId);
    this.authSettingsForm.controls.clientSecret.setValue(response.clientSecret);
    this.authSettingsForm.controls.communicationServerSystemEmailAccount.setValue(
      response.communicationServerSystemEmailAccount,
    );
  }

  updateAuthSettings() {
    this.settingsService.update(
      this.authSettingsForm.controls.appURL.value,
      this.authSettingsForm.controls.authServerURL.value,
      this.authSettingsForm.controls.clientId.value,
      this.authSettingsForm.controls.clientSecret.value,
      this.authSettingsForm.controls.communicationServerSystemEmailAccount
        .value,
    );
  }
}
