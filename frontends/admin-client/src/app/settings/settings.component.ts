import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { SettingsService } from './settings.service';
import { SERVICES, ISSUER_URL } from '../constants/storage';
import { ServiceList } from './service-list.interface';
import { from, empty } from 'rxjs';
import { mergeMap, toArray, map, catchError } from 'rxjs/operators';
import { ISettings } from './settings.interface';
import {
  IS_DOWN,
  CLOSE,
  UPDATE_SUCCESSFUL,
  ERROR_UPDATING_SERVICE_SETTINGS,
} from '../constants/messages';
import { MatSnackBar } from '@angular/material';

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
  communicationServerSystemEmailAccount: string;
  emailAccounts: any[];
  clientsFormGroup: FormGroup;
  clientsFormArray: FormArray;
  cloudStorageList: { uuid: string; name: string }[] = [];

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
    communicationServerSystemEmailAccount: new FormControl(
      this.communicationServerSystemEmailAccount,
    ),
  });

  constructor(
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.clientsFormGroup = this.formBuilder.group({
      clientsFormArray: new FormArray([]),
    });

    this.clientsFormArray = this.clientsFormGroup.get(
      'clientsFormArray',
    ) as FormArray;

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

    this.settingsService.getSavedEmailAccount<any>().subscribe({
      next: settings => {
        this.communicationServerSystemEmailAccount =
          settings.communicationServerSystemEmailAccount;
        this.authSettingsForm.controls.communicationServerSystemEmailAccount.setValue(
          this.communicationServerSystemEmailAccount,
        );
      },
    });

    this.populateServicesSettings();

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

    this.settingsService.getBucketOptions().subscribe({
      next: storages => (this.cloudStorageList = storages),
      error: error => {},
    });
  }

  populateServicesSettings() {
    const services: ServiceList[] = JSON.parse(localStorage.getItem(SERVICES));
    from(services)
      .pipe(
        mergeMap(service => {
          const serviceName = this.kebabToTitleCase(service.type);
          return this.settingsService.getClientSettings(service.url).pipe(
            catchError(error => {
              this.snackBar.open(`${serviceName} ${IS_DOWN}`, CLOSE, {
                duration: 2000,
              });
              return empty();
            }),
            map((data: ISettings) => {
              if (data) {
                data.serviceName = serviceName;
                return data;
              }
            }),
          );
        }),
        toArray(),
      )
      .subscribe({
        next: (servicesSettings: ISettings[]) => {
          for (const settings of servicesSettings) {
            if (settings) {
              this.clientsFormArray.push(
                this.createClientsFormArrayItem(settings),
              );
            }
          }
        },
        error: error => {},
      });
  }

  createClientsFormArrayItem(settings: ISettings): FormGroup {
    const client = this.formBuilder.group({
      appURL: settings.appURL,
      clientId: settings.clientId,
      clientSecret: settings.clientSecret,
      cloudStorageSettings: settings.cloudStorageSettings,
      serviceName: settings.serviceName,
      hide: true,
    });

    client.controls.appURL.disable();

    return client;
  }

  populateForm(response) {
    this.authSettingsForm.controls.issuerUrl.setValue(response.issuerUrl);
    this.authSettingsForm.controls.communicationServerClientId.setValue(
      response.communicationServerClientId,
    );
  }

  updateAuthSettings() {
    this.settingsService
      .update(
        this.authSettingsForm.controls.issuerUrl.value,
        this.authSettingsForm.controls.communicationServerClientId.value,
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

  updateClientSettings(client: FormGroup) {
    const authServerURL = localStorage.getItem(ISSUER_URL);
    const appURL = client.controls.appURL.value;
    const clientId = client.controls.clientId.value;
    const clientSecret = client.controls.clientSecret.value;
    const cloudStorageSettings = client.controls.cloudStorageSettings.value;
    this.settingsService
      .updateClientSettings(appURL, {
        authServerURL,
        appURL,
        clientId,
        clientSecret,
        cloudStorageSettings,
      })
      .subscribe({
        next: success => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: 2000 });
        },
        error: error => {
          this.snackBar.open(ERROR_UPDATING_SERVICE_SETTINGS, CLOSE, {
            duration: 2000,
          });
        },
      });
  }
}
