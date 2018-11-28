import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from './settings.service';
import { APP_URL, ISSUER_URL } from '../constants/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  issuerUrl: string;
  communicationServerClientId: string;
  clientList: any[];
  appURL: string;
  clientId: string;
  clientSecret: string;
  hide: boolean = true;

  infraSettingsForm = new FormGroup({
    appURL: new FormControl(this.appURL),
    clientId: new FormControl(this.clientId),
    clientSecret: new FormControl(this.clientSecret),
  });

  authSettingsForm = new FormGroup({
    issuerUrl: new FormControl(this.issuerUrl),
    communicationServerClientId: new FormControl(
      this.communicationServerClientId,
    ),
  });

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.getClientSettings().subscribe({
      next: (clientResponse: {
        appURL: string;
        clientId: string;
        clientSecret: string;
      }) => {
        this.appURL = clientResponse.appURL;
        this.clientId = clientResponse.clientId;
        this.clientSecret = clientResponse.clientSecret;
        this.populateClientForm(clientResponse);
      },
    });

    this.settingsService.getSettings().subscribe({
      next: (response: {
        issuerUrl: string;
        communicationServerClientId: string;
      }) => {
        this.issuerUrl = response.issuerUrl;
        this.communicationServerClientId = response.communicationServerClientId;
        this.populateForm(response);
      },
    });
    this.settingsService.getClientList().subscribe({
      next: (response: any[]) => {
        this.clientList = response;
      },
    });
  }

  populateForm(response) {
    this.authSettingsForm.controls.issuerUrl.setValue(response.issuerUrl);
    this.authSettingsForm.controls.communicationServerClientId.setValue(
      response.communicationServerClientId,
    );
  }

  populateClientForm(clientResponse) {
    this.infraSettingsForm.controls.appURL.setValue(clientResponse.appURL);
    this.infraSettingsForm.controls.clientId.setValue(clientResponse.clientId);
    this.infraSettingsForm.controls.clientSecret.setValue(
      clientResponse.clientSecret,
    );
  }

  updateAuthSettings() {
    this.settingsService
      .update(
        this.authSettingsForm.controls.issuerUrl.value,
        this.authSettingsForm.controls.communicationServerClientId.value,
      )
      .subscribe({
        next: response => {},
      });
  }

  updateAuthClientSettings() {
    this.settingsService.getClientUpdate(
      localStorage.getItem(APP_URL),
      localStorage.getItem(ISSUER_URL),
      this.infraSettingsForm.controls.clientId.value,
      this.infraSettingsForm.controls.clientSecret.value,
    );
  }
}
