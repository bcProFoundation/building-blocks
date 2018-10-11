import { OnInit, Component } from '@angular/core';
import { ClientService } from '../client/client.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { CLIENT_UPDATED } from '../constants/messages';
import { NEW_ID } from '../constants/common';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit {
  uuid: string;
  clientId: string;
  clientName: string;
  clientURL: string;
  isTrusted: boolean;
  clientScopes: any[];
  callbackURLs: string[];

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
      clientName: '',
      clientURL: '',
      clientScopes: '',
      callbackURLForms: this.formBuilder.array([]),
      isTrusted: '',
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

  subscribeGetClient(clientId: string) {
    this.clientService.getClient(clientId).subscribe({
      next: response => {
        if (response) {
          this.clientId = response.clientId;
          this.clientName = response.name;
          this.callbackURLs = response.redirectUris;
          this.callbackURLs.forEach(element => {
            this.addCallbackURL(element);
          });
          this.clientForm.controls.clientName.setValue(response.name);
          this.clientForm.controls.isTrusted.setValue(response.isTrusted);
          this.clientForm.controls.clientScopes.setValue(
            response.allowedScopes,
          );
        }
      },
    });
  }

  createClient() {
    this.clientService.createClient(
      this.clientForm.controls.clientName.value,
      this.getCallbackURLs(),
      this.clientForm.controls.clientScopes.value,
      this.clientForm.controls.isTrusted.value,
    );
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
        this.getCallbackURLs(),
        this.clientForm.controls.clientScopes.value,
        this.clientForm.controls.isTrusted.value,
      )
      .subscribe({
        next: (response: any) => {
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
}
