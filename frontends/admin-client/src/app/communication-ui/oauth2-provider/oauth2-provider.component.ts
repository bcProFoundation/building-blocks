import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OAuth2ProviderService } from './oauth2-provider.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import {
  CREATE_SUCCESSFUL,
  CLOSE,
  CREATE_ERROR,
  UPDATE_SUCCESSFUL,
  UPDATE_ERROR,
} from 'src/app/constants/messages';
import { NEW_ID } from 'src/app/constants/common';

export const OAUTH2_PROVIDER_LIST_ROUTE = '/oauth2_provider/list';

@Component({
  selector: 'app-oauth2-provider',
  templateUrl: './oauth2-provider.component.html',
  styleUrls: ['./oauth2-provider.component.css'],
})
export class OAuth2ProviderComponent implements OnInit {
  uuid: string;
  hideClientSecret: boolean = true;
  name: string;
  providerForm = new FormGroup({
    name: new FormControl(),
    authServerURL: new FormControl(),
    clientId: new FormControl(),
    clientSecret: new FormControl(),
    redirectURI: new FormControl(),
    profileURL: new FormControl(),
    tokenURL: new FormControl(),
    introspectionURL: new FormControl(),
    authorizationURL: new FormControl(),
    revocationURL: new FormControl(),
  });

  constructor(
    private service: OAuth2ProviderService,
    private snackBar: MatSnackBar,
    private router: Router,
    route: ActivatedRoute,
  ) {
    this.uuid = route.snapshot.params.id;
  }

  ngOnInit() {
    if (this.uuid !== NEW_ID) {
      this.service.getProvider(this.uuid).subscribe({
        next: response => {
          this.name = response.name;
          this.providerForm.controls.name.setValue(response.name);
          this.providerForm.controls.authServerURL.setValue(
            response.authServerURL,
          );
          this.providerForm.controls.clientId.setValue(response.clientId);
          this.providerForm.controls.clientSecret.setValue(
            response.clientSecret,
          );
          this.providerForm.controls.redirectURI.setValue(
            this.service.generateRedirectURL(this.uuid),
          );
          this.providerForm.controls.profileURL.setValue(response.profileURL);
          this.providerForm.controls.tokenURL.setValue(response.tokenURL);
          this.providerForm.controls.introspectionURL.setValue(
            response.introspectionURL,
          );
          this.providerForm.controls.authorizationURL.setValue(
            response.authorizationURL,
          );
          this.providerForm.controls.revocationURL.setValue(
            response.revocationURL,
          );
        },
      });
    }
  }

  createProvider() {
    this.service
      .createProvider(
        this.providerForm.controls.name.value,
        this.providerForm.controls.authServerURL.value,
        this.providerForm.controls.clientId.value,
        this.providerForm.controls.clientSecret.value,
        this.providerForm.controls.profileURL.value,
        this.providerForm.controls.tokenURL.value,
        this.providerForm.controls.introspectionURL.value,
        this.providerForm.controls.authorizationURL.value,
        this.providerForm.controls.revocationURL.value,
      )
      .subscribe({
        next: response => {
          this.snackBar.open(CREATE_SUCCESSFUL, CLOSE, { duration: 2000 });
          this.router.navigateByUrl(OAUTH2_PROVIDER_LIST_ROUTE);
        },
        error: error => {
          this.snackBar.open(CREATE_ERROR, CLOSE, { duration: 2000 });
        },
      });
  }

  updateProvider() {
    this.service
      .updateProvider(
        this.uuid,
        this.providerForm.controls.name.value,
        this.providerForm.controls.authServerURL.value,
        this.providerForm.controls.clientId.value,
        this.providerForm.controls.clientSecret.value,
        this.providerForm.controls.profileURL.value,
        this.providerForm.controls.tokenURL.value,
        this.providerForm.controls.introspectionURL.value,
        this.providerForm.controls.authorizationURL.value,
        this.providerForm.controls.revocationURL.value,
      )
      .subscribe({
        next: response => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: 2000 });
          this.router.navigateByUrl(OAUTH2_PROVIDER_LIST_ROUTE);
        },
        error: error => {
          this.snackBar.open(UPDATE_ERROR, CLOSE, { duration: 2000 });
        },
      });
  }
}
