import { OnInit, Component } from '@angular/core';
import { ClientService } from '../client/client.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import {
  CLIENT_UPDATED,
  CLIENT_CREATED,
  CLIENT_ERROR,
} from '../constants/messages';
import { NEW_ID } from '../constants/common';
import { CreateClientResponse } from '../interfaces/client-response.interface';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit {
  uuid: string;
  clientId: string;
  clientName: string;
  clientSecret: string;
  clientURL: string;
  isTrusted: boolean;
  clientScopes: any[];
  callbackURLs: string[];
  tokenDeleteEndpoint: string;
  userDeleteEndpoint: string;
  changedClientSecret: string;

  hideClientSecret: boolean = true;
  hideChangedClientSecret: boolean = true;

  scopes: any[] = [];

  clientForm: FormGroup;
  callbackURLForms: FormArray;

  constructor(
    private readonly clientService: ClientService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private formBuilder: FormBuilder,
  ) {
    this.uuid = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.clientForm = this.formBuilder.group({
      clientName: this.clientName,
      clientURL: this.clientURL,
      clientScopes: this.clientScopes,
      tokenDeleteEndpoint: this.tokenDeleteEndpoint,
      userDeleteEndpoint: this.userDeleteEndpoint,
      callbackURLForms: this.formBuilder.array([]),
      isTrusted: this.isTrusted,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      changedClientSecret: this.changedClientSecret,
    });

    if (this.uuid && this.uuid !== NEW_ID) {
      this.subscribeGetClient(this.uuid);
    }
    this.subscribeGetScopes();
  }

  createCallbackURLFormGroup(callbackURL?: string): FormGroup {
    return this.formBuilder.group({
      callbackURL,
    });
  }

  addCallbackURL(callbackURL?: string) {
    this.callbackURLForms = this.clientForm.get(
      'callbackURLForms',
    ) as FormArray;
    this.callbackURLForms.push(this.createCallbackURLFormGroup(callbackURL));
  }

  removeCallbackURL(formGroupID: number) {
    this.callbackURLForms.removeAt(formGroupID);
  }

  subscribeGetClient(clientId: string) {
    this.clientService.getClient(clientId).subscribe({
      next: response => {
        if (response) {
          this.changedClientSecret = response.changedClientSecret;
          this.populateClientForm(response);
        }
      },
    });
  }

  createClient() {
    this.clientService
      .createClient(
        this.clientForm.controls.clientName.value,
        this.getCallbackURLs(),
        this.clientForm.controls.clientScopes.value,
        this.clientForm.controls.isTrusted.value || '0',
      )
      .subscribe({
        next: (response: CreateClientResponse) => {
          this.clientName = response.name;
          this.clientId = response.clientId;
          this.clientSecret = response.clientSecret;
          this.uuid = response.uuid;
          this.clientForm.controls.clientId.setValue(response.clientId);
          this.clientForm.controls.clientSecret.setValue(response.clientSecret);
          this.tokenDeleteEndpoint = response.tokenDeleteEndpoint;
          this.userDeleteEndpoint = response.userDeleteEndpoint;
          this.changedClientSecret = response.changedClientSecret;
          this.snackbar.open(CLIENT_CREATED, 'Close', { duration: 2500 });
        },
        error: error => {
          this.snackbar.open(CLIENT_ERROR, 'Close', { duration: 2500 });
        },
      });
  }

  getCallbackURLs(): string[] {
    const callbackURLFormGroups = this.clientForm.get(
      'callbackURLForms',
    ) as FormArray;
    const callbackURLs: string[] = [];
    for (const control of callbackURLFormGroups.controls) {
      callbackURLs.push(control.value.callbackURL);
    }
    return callbackURLs;
  }

  updateClient() {
    this.clientService
      .updateClient(
        this.clientId,
        this.clientForm.controls.clientName.value,
        this.clientForm.controls.tokenDeleteEndpoint.value,
        this.clientForm.controls.userDeleteEndpoint.value,
        this.getCallbackURLs(),
        this.clientForm.controls.clientScopes.value,
        this.clientForm.controls.isTrusted.value,
      )
      .subscribe({
        next: () => {
          this.snackbar.open(CLIENT_UPDATED, 'Close', { duration: 2500 });
        },
      });
  }

  subscribeGetScopes() {
    this.clientService.getScopes().subscribe({
      next: (response: any) => {
        if (response) {
          response.map(scope => {
            this.scopes.push(scope.name);
          });
        }
      },
    });
  }

  populateClientForm(client) {
    this.clientId = client.clientId;
    this.clientSecret = client.clientSecret;
    this.clientName = client.name;
    this.callbackURLs = client.redirectUris;
    this.clientForm.controls.tokenDeleteEndpoint.setValue(
      client.tokenDeleteEndpoint,
    );
    this.clientForm.controls.userDeleteEndpoint.setValue(
      client.userDeleteEndpoint,
    );
    this.clientForm.controls.changedClientSecret.setValue(
      client.changedClientSecret,
    );
    this.callbackURLs.forEach(element => {
      this.addCallbackURL(element);
    });
    this.clientForm.controls.clientId.setValue(client.clientId);
    this.clientForm.controls.clientSecret.setValue(client.clientSecret);
    this.clientForm.controls.clientName.setValue(client.name);
    this.clientForm.controls.isTrusted.setValue(client.isTrusted);
    this.clientForm.controls.clientScopes.setValue(client.allowedScopes);
  }
}
