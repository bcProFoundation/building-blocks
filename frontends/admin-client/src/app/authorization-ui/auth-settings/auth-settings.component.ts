import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthSettingsService } from './auth-settings.service';
import {
  CLOSE,
  UPDATE_SUCCESSFUL,
  DELETING,
  UNDO,
} from '../../constants/messages';
import { MatSnackBar } from '@angular/material';
import { DURATION, UNDO_DURATION } from '../../constants/common';

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
  disableSignup: boolean;
  flagDeleteUserSessions: boolean = false;
  flagDeleteBearerTokens: boolean = false;
  disableDeleteSessions: boolean = false;
  disableDeleteTokens: boolean = false;
  enableChoosingAccount: boolean;

  authSettingsForm = new FormGroup({
    issuerUrl: new FormControl(this.issuerUrl),
    disableSignup: new FormControl(this.disableSignup),
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
    enableChoosingAccount: new FormControl(this.enableChoosingAccount),
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
        disableSignup: boolean;
        enableChoosingAccount: boolean;
      }) => {
        this.issuerUrl = response.issuerUrl;
        this.communicationServerClientId = response.communicationServerClientId;
        this.disableSignup = response.disableSignup;
        this.enableChoosingAccount = response.enableChoosingAccount;
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
    this.authSettingsForm.controls.disableSignup.setValue(
      response.disableSignup,
    );
    this.authSettingsForm.controls.infrastructureConsoleClientId.setValue(
      response.infrastructureConsoleClientId,
    );
    this.authSettingsForm.controls.identityProviderClientId.setValue(
      response.identityProviderClientId,
    );
    this.authSettingsForm.controls.communicationServerClientId.setValue(
      response.communicationServerClientId,
    );
    this.authSettingsForm.controls.enableChoosingAccount.setValue(
      response.enableChoosingAccount,
    );
  }

  updateAuthSettings() {
    this.settingsService
      .update(
        this.authSettingsForm.controls.issuerUrl.value,
        this.authSettingsForm.controls.disableSignup.value,
        this.authSettingsForm.controls.communicationServerClientId.value,
        this.authSettingsForm.controls.infrastructureConsoleClientId.value,
        this.authSettingsForm.controls.identityProviderClientId.value,
        this.authSettingsForm.controls.enableChoosingAccount.value,
      )
      .subscribe({
        next: response => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: DURATION });
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
            this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, {
              duration: DURATION,
            });
          },
          error: error => {},
        });
    }
  }

  deleteUserSessions() {
    this.flagDeleteUserSessions = true;
    this.disableDeleteSessions = true;
    this.disableDeleteTokens = true;
    const snackBar = this.snackBar.open(DELETING, UNDO, {
      duration: UNDO_DURATION,
    });

    snackBar.afterDismissed().subscribe({
      next: dismissed => {
        if (this.flagDeleteUserSessions) {
          this.settingsService.deleteUserSessions().subscribe({
            next: deleted => {
              this.logout();
            },
            error: error => {},
          });
        }
      },
      error: error => {},
    });

    snackBar.onAction().subscribe({
      next: success => {
        this.flagDeleteUserSessions = false;
        this.disableDeleteSessions = false;
        this.disableDeleteTokens = false;
      },
      error: error => {},
    });
  }

  deleteBearerTokens() {
    this.flagDeleteUserSessions = true;
    this.disableDeleteSessions = true;
    this.disableDeleteTokens = true;
    const snackBar = this.snackBar.open(DELETING, UNDO, {
      duration: UNDO_DURATION,
    });

    snackBar.afterDismissed().subscribe({
      next: dismissed => {
        if (this.flagDeleteUserSessions) {
          this.settingsService.deleteBearerTokens().subscribe({
            next: deleted => {
              this.logout();
            },
            error: error => {},
          });
        }
      },
      error: error => {},
    });

    snackBar.onAction().subscribe({
      next: success => {
        this.flagDeleteUserSessions = false;
        this.disableDeleteSessions = false;
        this.disableDeleteTokens = false;
      },
      error: error => {},
    });
  }

  logout() {
    this.settingsService.logout();
  }

  kebabToTitleCase(string: string) {
    return string
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
