import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InfrastructureSettingsService } from './infrastructure-settings.service';
import { UPDATE_SUCCESSFUL, CLOSE } from '../../constants/messages';
import { DURATION } from '../../constants/common';

@Component({
  selector: 'app-infrastructure-settings',
  templateUrl: './infrastructure-settings.component.html',
  styleUrls: ['./infrastructure-settings.component.css'],
})
export class InfrastructureSettingsComponent implements OnInit {
  appURL: string;
  clientId: string;
  clientSecret: string;
  hideClientSecret = true;

  settingsForm = new FormGroup({
    appURL: new FormControl(this.appURL),
    clientId: new FormControl(this.clientId),
    clientSecret: new FormControl(this.clientSecret),
  });

  constructor(
    private settingsService: InfrastructureSettingsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.settingsService.getSettings().subscribe({
      next: (response: any) => {
        this.appURL = response.appUrl;
        this.populateForm(response);
      },
      error: error => {},
    });
  }

  populateForm(response) {
    this.settingsForm.controls.appURL.setValue(response.appURL);
    this.settingsForm.controls.clientId.setValue(response.clientId);
    this.settingsForm.controls.clientSecret.setValue(response.clientSecret);
  }

  updateSettings() {
    this.settingsService
      .updateSettings(
        this.settingsForm.controls.appURL.value,
        this.settingsForm.controls.clientId.value,
        this.settingsForm.controls.clientSecret.value,
      )
      .subscribe({
        next: response => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: DURATION });
        },
        error: error => {},
      });
  }
}
