import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthSettingsService } from './auth-settings.service';
import { CLOSE, UPDATE_SUCCESSFUL } from '../../constants/messages';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-auth-settings',
  templateUrl: './auth-settings.component.html',
  styleUrls: ['./auth-settings.component.css'],
})
export class AuthSettingsComponent implements OnInit {
  issuerUrl: string;
  identityProviderClientId: string;
  infrastructureConsoleClientId: string;
  communicationServerClientId: string;
  clientList: any[];
  appURL: string;
  clientId: string;
  clientSecret: string;
  communicationServerSystemEmailAccount: string;
  emailAccounts: any[];
  cloudStorageList: { uuid: string; name: string }[] = [];

  authSettingsForm = new FormGroup({
    issuerUrl: new FormControl(this.issuerUrl),
    infrastructureConsoleClientId: new FormControl(
      this.infrastructureConsoleClientId,
    ),
    identityProviderClientId: new FormControl(this.identityProviderClientId),
    communicationServerClientId: new FormControl(
      this.communicationServerClientId,
    ),
    communicationServerSystemEmailAccount: new FormControl(
      this.communicationServerSystemEmailAccount,
    ),
  });

  constructor(
    private settingsService: AuthSettingsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.settingsService.getSettings().subscribe({
      next: (response: {
        issuerUrl: string;
        communicationServerClientId: string;
      }) => {
        this.issuerUrl = response.issuerUrl;
        this.communicationServerClientId = response.communicationServerClientId;
        this.populateForm(response);
      },
      error: error => {},
    });

    this.settingsService.getClientList().subscribe({
      next: (response: any[]) => {
        this.clientList = response;
      },
      error: error => {},
    });
  }

  populateForm(response) {
    this.authSettingsForm.controls.issuerUrl.setValue(response.issuerUrl);
    this.authSettingsForm.controls.infrastructureConsoleClientId.setValue(
      response.infrastructureConsoleClientId,
    );
    this.authSettingsForm.controls.identityProviderClientId.setValue(
      response.identityProviderClientId,
    );
    this.authSettingsForm.controls.communicationServerClientId.setValue(
      response.communicationServerClientId,
    );
  }

  updateAuthSettings() {
    this.settingsService
      .update(
        this.authSettingsForm.controls.issuerUrl.value,
        this.authSettingsForm.controls.communicationServerClientId.value,
        this.authSettingsForm.controls.infrastructureConsoleClientId.value,
        this.authSettingsForm.controls.identityProviderClientId.value,
      )
      .subscribe({
        next: response => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: 2000 });
        },
        error: error => {},
      });

    if (
      this.authSettingsForm.controls.communicationServerSystemEmailAccount.value
    ) {
      this.settingsService
        .updateSystemEmailSettings(
          this.authSettingsForm.controls.communicationServerSystemEmailAccount
            .value,
        )
        .subscribe({
          next: success => {
            this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: 2000 });
          },
          error: error => {},
        });
    }
  }

  kebabToTitleCase(string: string) {
    return string
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
