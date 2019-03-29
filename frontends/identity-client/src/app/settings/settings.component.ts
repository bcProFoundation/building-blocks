import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from './settings.service';
import { IdpServerSettings } from '../interfaces/Idp-server-settings.interface';

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
  emailAccounts: any[];
  hide: boolean = true;
  cloudStorageSettings: any;
  bucketOptions: any[];

  authSettingsForm = new FormGroup({
    cloudStorageSettings: new FormControl(this.cloudStorageSettings),
    appURL: new FormControl(this.appURL),
    authServerURL: new FormControl(this.authServerURL),
    clientId: new FormControl(this.clientId),
    clientSecret: new FormControl(this.clientSecret),
  });

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.getSettings().subscribe({
      next: (response: IdpServerSettings) => {
        this.appURL = response.appURL;
        this.authServerURL = response.authServerURL;
        this.clientId = response.clientId;
        this.clientSecret = response.clientSecret;
        this.cloudStorageSettings = response.cloudStorageSettings;
      },
    });
    this.settingsService.getSettings().subscribe({
      next: (response: any[]) => {
        this.populateForm(response);
      },
    });

    this.settingsService.getBucketOptions().subscribe({
      next: (response: any) => {
        this.bucketOptions = response;
      },
      error: err => {
        err;
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
    this.cloudStorageSettings = response.cloudStorageSettings;
    this.authSettingsForm.controls.cloudStorageSettings.setValue(
      response.cloudStorageSettings,
    );
  }

  updateAuthSettings() {
    this.settingsService.update(
      this.authSettingsForm.controls.appURL.value,
      this.authSettingsForm.controls.authServerURL.value,
      this.authSettingsForm.controls.clientId.value,
      this.authSettingsForm.controls.clientSecret.value,
      this.authSettingsForm.controls.cloudStorageSettings.value,
    );
  }
}
