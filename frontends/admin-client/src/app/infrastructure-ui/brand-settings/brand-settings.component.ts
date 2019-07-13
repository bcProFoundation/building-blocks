import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { BrandSettingsService } from './brand-settings.service';
import {
  UPDATE_SUCCESSFUL,
  CLOSE,
  UPDATE_ERROR,
} from '../../constants/messages';
import { DURATION } from '../../constants/common';

@Component({
  selector: 'app-brand-settings',
  templateUrl: './brand-settings.component.html',
  styleUrls: ['./brand-settings.component.css'],
})
export class BrandSettingsComponent implements OnInit {
  logoURL: string;
  faviconURL: string;
  helpURL: string;
  privacyURL: string;
  termsURL: string;
  accentColor: string;
  warnColor: string;
  primaryColor: string;
  foregroundColor: string;
  backgroundColor: string;
  copyrightMessage: string;

  settingsForm = new FormGroup({
    logoURL: new FormControl(this.logoURL),
    faviconURL: new FormControl(this.faviconURL),
    helpURL: new FormControl(this.helpURL),
    privacyURL: new FormControl(this.privacyURL),
    termsURL: new FormControl(this.termsURL),
    accentColor: new FormControl(this.accentColor),
    warnColor: new FormControl(this.warnColor),
    primaryColor: new FormControl(this.primaryColor),
    foregroundColor: new FormControl(this.foregroundColor),
    backgroundColor: new FormControl(this.backgroundColor),
    copyrightMessage: new FormControl(this.copyrightMessage),
  });

  constructor(
    private snackBar: MatSnackBar,
    private service: BrandSettingsService,
  ) {}

  ngOnInit() {
    this.service.retrieveSettings().subscribe({
      next: response => {
        this.populateForm(response);
      },
      error: error => {},
    });
  }

  selectAccentColor(event) {
    if (event === 'none') event = undefined;
    this.accentColor = event;
    this.settingsForm.controls.accentColor.setValue(event);
  }

  selectPrimaryColor(event) {
    if (event === 'none') event = undefined;
    this.primaryColor = event;
    this.settingsForm.controls.primaryColor.setValue(event);
  }

  selectWarnColor(event) {
    if (event === 'none') event = undefined;
    this.warnColor = event;
    this.settingsForm.controls.warnColor.setValue(event);
  }

  selectForegroundColor(event) {
    if (event === 'none') event = undefined;
    this.foregroundColor = event;
    this.settingsForm.controls.foregroundColor.setValue(event);
  }

  selectBackgroundColor(event) {
    if (event === 'none') event = undefined;
    this.backgroundColor = event;
    this.settingsForm.controls.backgroundColor.setValue(event);
  }

  updateSettings() {
    this.service
      .updateSettings(
        this.settingsForm.controls.logoURL.value,
        this.settingsForm.controls.faviconURL.value,
        this.settingsForm.controls.privacyURL.value,
        this.settingsForm.controls.termsURL.value,
        this.settingsForm.controls.helpURL.value,
        this.settingsForm.controls.copyrightMessage.value,
        this.settingsForm.controls.primaryColor.value,
        this.settingsForm.controls.accentColor.value,
        this.settingsForm.controls.warnColor.value,
        this.settingsForm.controls.foregroundColor.value,
        this.settingsForm.controls.backgroundColor.value,
      )
      .subscribe({
        next: success => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: DURATION });
        },
        error: error => {
          this.snackBar.open(UPDATE_ERROR, CLOSE, { duration: DURATION });
        },
      });
  }

  populateForm(response) {
    this.primaryColor = response.primaryColor;
    this.accentColor = response.accentColor;
    this.warnColor = response.warnColor;
    this.logoURL = response.logoURL;
    this.helpURL = response.helpURL;
    this.privacyURL = response.privacyURL;
    this.termsURL = response.termsURL;
    this.backgroundColor = response.backgroundColor;
    this.foregroundColor = response.foregroundColor;
    this.faviconURL = response.faviconURL;
    this.copyrightMessage = response.copyrightMessage;

    this.settingsForm.controls.primaryColor.setValue(this.primaryColor);
    this.settingsForm.controls.accentColor.setValue(this.accentColor);
    this.settingsForm.controls.warnColor.setValue(this.warnColor);
    this.settingsForm.controls.logoURL.setValue(this.logoURL);
    this.settingsForm.controls.helpURL.setValue(this.helpURL);
    this.settingsForm.controls.copyrightMessage.setValue(this.copyrightMessage);
    this.settingsForm.controls.privacyURL.setValue(this.privacyURL);
    this.settingsForm.controls.termsURL.setValue(this.termsURL);
    this.settingsForm.controls.backgroundColor.setValue(this.backgroundColor);
    this.settingsForm.controls.foregroundColor.setValue(this.foregroundColor);
    this.settingsForm.controls.faviconURL.setValue(this.faviconURL);
  }
}
