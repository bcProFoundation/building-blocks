import { Component, OnInit } from '@angular/core';
import { CommunicationSettingsService } from './communication-settings.service';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { UPDATE_SUCCESSFUL, CLOSE } from '../../constants/messages';
import { DURATION } from '../../constants/common';

export interface EmailAccount {
  host: string;
  uuid: string;
}

@Component({
  selector: 'app-communication-settings',
  templateUrl: './communication-settings.component.html',
  styleUrls: ['./communication-settings.component.css'],
})
export class CommunicationSettingsComponent implements OnInit {
  appURL: string;
  clientList: { clientId: string; name: string }[];
  clientId: string;
  clientSecret: string;
  emailAccounts: EmailAccount[] = [];
  communicationServerSystemEmailAccount: string;
  hideClientSecret = true;

  settingsForm = new FormGroup({
    appURL: new FormControl(this.appURL),
    clientList: new FormControl(this.clientList),
    clientId: new FormControl(this.clientId),
    clientSecret: new FormControl(this.clientSecret),
    communicationServerSystemEmailAccount: new FormControl(
      this.communicationServerSystemEmailAccount,
    ),
  });

  constructor(
    private settingsService: CommunicationSettingsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.settingsService.getSettings().subscribe({
      next: (response: any) => {
        this.appURL = response.appUrl;
        this.communicationServerSystemEmailAccount =
          response.communicationServerSystemEmailAccount;
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

    this.settingsService.getEmailAccounts().subscribe({
      next: emails => {
        this.emailAccounts = emails;
      },
      error: error => {},
    });
  }

  populateForm(response) {
    this.settingsForm.controls.appURL.setValue(response.appURL);
    this.settingsForm.controls.clientList.setValue(response.clientList);
    this.settingsForm.controls.clientId.setValue(response.clientId);
    this.settingsForm.controls.clientSecret.setValue(response.clientSecret);
    this.settingsForm.controls.communicationServerSystemEmailAccount.setValue(
      response.communicationServerSystemEmailAccount,
    );
  }

  updateSettings() {
    this.settingsService
      .updateSettings(
        this.settingsForm.controls.appURL.value,
        this.settingsForm.controls.clientId.value,
        this.settingsForm.controls.clientSecret.value,
        this.settingsForm.controls.communicationServerSystemEmailAccount.value,
      )
      .subscribe({
        next: response => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: DURATION });
        },
        error: error => {},
      });
  }
}
