import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IdpSettingsService } from './idp-settings.service';
import { MatSnackBar } from '@angular/material';
import { UPDATE_SUCCESSFUL, CLOSE } from 'src/app/constants/messages';

export interface CloudStorage {
  name: string;
  uuid: string;
}

@Component({
  selector: 'app-idp-settings',
  templateUrl: './idp-settings.component.html',
  styleUrls: ['./idp-settings.component.css'],
})
export class IdpSettingsComponent implements OnInit {
  appURL: string;
  clientId: string;
  clientSecret: string;
  cloudStorages: CloudStorage[] = [];
  cloudStorageSettings: string;
  hideClientSecret = true;

  settingsForm = new FormGroup({
    appURL: new FormControl(this.appURL),
    clientId: new FormControl(this.clientId),
    clientSecret: new FormControl(this.clientSecret),
    cloudStorageSettings: new FormControl(this.cloudStorageSettings),
  });

  constructor(
    private settingsService: IdpSettingsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.settingsService.getCloudStorages().subscribe({
      next: storages => {
        this.cloudStorages = storages;
      },
      error: error => {},
    });

    this.settingsService.getSettings().subscribe({
      next: (response: any) => {
        this.appURL = response.appUrl;
        this.cloudStorageSettings = response.cloudStorageSettings;
        this.populateForm(response);
      },
      error: error => {},
    });
  }

  populateForm(response) {
    this.settingsForm.controls.appURL.setValue(response.appURL);
    this.settingsForm.controls.clientId.setValue(response.clientId);
    this.settingsForm.controls.clientSecret.setValue(response.clientSecret);
    this.settingsForm.controls.cloudStorageSettings.setValue(
      response.cloudStorageSettings,
    );
  }

  updateSettings() {
    this.settingsService
      .updateSettings(
        this.settingsForm.controls.appURL.value,
        this.settingsForm.controls.clientId.value,
        this.settingsForm.controls.clientSecret.value,
        this.settingsForm.controls.cloudStorageSettings.value,
      )
      .subscribe({
        next: response => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: 2000 });
        },
        error: error => {},
      });
  }
}
