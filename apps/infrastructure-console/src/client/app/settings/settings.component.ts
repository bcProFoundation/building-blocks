import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from './settings.service';
import { APP_URL } from '../constants/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  issuerUrl: string;
  communicationServerClientId: string;
  clientList: any[];
  authServerURL: string;
  clientId: string;
  clientSecret: string;
  hide: boolean = true;

  comSettingsForm = new FormGroup({
    authServerURL: new FormControl(this.authServerURL),
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
        authServerURL: string;
        clientId: string;
        clientSecret: string;
      }) => {
        this.authServerURL = clientResponse.authServerURL;
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
    this.comSettingsForm.controls.authServerURL.setValue(
      clientResponse.authServerURL,
    );
    this.comSettingsForm.controls.clientId.setValue(clientResponse.clientId);
    this.comSettingsForm.controls.clientSecret.setValue(
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
      this.comSettingsForm.controls.authServerURL.value,
      this.comSettingsForm.controls.clientId.value,
      this.comSettingsForm.controls.clientSecret.value,
    );
  }
}
