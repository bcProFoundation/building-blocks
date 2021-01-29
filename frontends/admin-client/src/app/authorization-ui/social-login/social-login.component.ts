import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SocialLoginService } from './social-login.service';
import { NEW_ID, DURATION } from '../../constants/common';
import {
  SOCIAL_LOGIN_ERROR,
  SOCIAL_LOGIN_UPDATED,
  SOCIAL_LOGIN_CREATED,
  CLOSE,
  UPDATE_ERROR,
  DELETE_ERROR,
} from '../../constants/messages';
import { DeleteDialogComponent } from '../../shared-ui/delete-dialog/delete-dialog.component';

export const SOCIAL_LOGIN_LIST_ROUTE = '/social_login/list';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css'],
})
export class SocialLoginComponent implements OnInit {
  name: string;
  description: string;
  uuid: string;
  clientId: string;
  clientSecret: string;
  authorizationURL: string;
  tokenURL: string;
  introspectionURL: string;
  baseURL: string;
  profileURL: string;
  revocationURL: string;
  scope: string[];
  clientSecretToTokenEndpoint: boolean;
  hideClientSecret: boolean = true;
  redirectURL: string;

  scopesForm = new FormArray([]);

  socialLoginForm = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    clientId: new FormControl(),
    clientSecret: new FormControl(),
    authorizationURL: new FormControl(),
    tokenURL: new FormControl(),
    introspectionURL: new FormControl(),
    baseURL: new FormControl(),
    profileURL: new FormControl(),
    revocationURL: new FormControl(),
    clientSecretToTokenEndpoint: new FormControl(),
    scope: this.scopesForm,
    redirectURL: new FormControl(),
  });
  new = NEW_ID;

  constructor(
    private socialLoginService: SocialLoginService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.uuid = this.route.snapshot.params.id;
  }

  ngOnInit() {
    if (this.uuid && this.uuid !== this.new) {
      this.subscribeGetSocialLogin(this.uuid);
    } else if (this.uuid === NEW_ID) {
      this.uuid = undefined;
    }
  }

  subscribeGetSocialLogin(uuid: string) {
    this.socialLoginService.getSocialLogin(uuid).subscribe({
      next: response => {
        if (response) {
          this.populateForm(response);
        }
      },
    });
  }

  populateForm(socialLogin) {
    this.name = socialLogin.name;
    this.description = socialLogin.description;
    this.clientId = socialLogin.clientId;
    this.clientSecret = socialLogin.clientSecret;
    this.authorizationURL = socialLogin.authorizationURL;
    this.tokenURL = socialLogin.tokenURL;
    this.introspectionURL = socialLogin.introspectionURL;
    this.baseURL = socialLogin.baseURL;
    this.profileURL = socialLogin.profileURL;
    this.revocationURL = socialLogin.revocationURL;
    this.scope = socialLogin.scope;
    this.clientSecretToTokenEndpoint = socialLogin.clientSecretToTokenEndpoint;
    this.redirectURL = this.socialLoginService.generateRedirectURL(
      socialLogin.uuid,
    );
    this.scope.forEach(scope => {
      this.addScope(scope);
    });
    this.socialLoginForm.controls.name.setValue(socialLogin.name);
    this.socialLoginForm.controls.description.setValue(socialLogin.description);
    this.socialLoginForm.controls.clientId.setValue(socialLogin.clientId);
    this.socialLoginForm.controls.clientSecret.setValue(
      socialLogin.clientSecret,
    );
    this.socialLoginForm.controls.authorizationURL.setValue(
      socialLogin.authorizationURL,
    );
    this.socialLoginForm.controls.tokenURL.setValue(socialLogin.tokenURL);
    this.socialLoginForm.controls.introspectionURL.setValue(
      socialLogin.introspectionURL,
    );
    this.socialLoginForm.controls.baseURL.setValue(socialLogin.baseURL);
    this.socialLoginForm.controls.profileURL.setValue(socialLogin.profileURL);
    this.socialLoginForm.controls.revocationURL.setValue(
      socialLogin.revocationURL,
    );
    this.socialLoginForm.controls.clientSecretToTokenEndpoint.setValue(
      socialLogin.clientSecretToTokenEndpoint,
    );
    this.socialLoginForm.controls.redirectURL.setValue(this.redirectURL);
  }

  addScope(scope?: string) {
    this.scopesForm.push(new FormGroup({ scope: new FormControl(scope) }));
  }

  removeScope(formGroupID: number) {
    this.scopesForm.removeAt(formGroupID);
  }

  createSocialLogin() {
    this.socialLoginService
      .createSocialLogin(
        this.socialLoginForm.controls.name.value,
        this.socialLoginForm.controls.description.value,
        this.socialLoginForm.controls.clientId.value,
        this.socialLoginForm.controls.clientSecret.value,
        this.socialLoginForm.controls.authorizationURL.value,
        this.socialLoginForm.controls.tokenURL.value,
        this.socialLoginForm.controls.introspectionURL.value,
        this.socialLoginForm.controls.baseURL.value,
        this.socialLoginForm.controls.profileURL.value,
        this.socialLoginForm.controls.revocationURL.value,
        this.getScopes(),
        this.socialLoginForm.controls.clientSecretToTokenEndpoint.value,
      )
      .subscribe({
        next: success => {
          this.snackBar.open(SOCIAL_LOGIN_CREATED, CLOSE, {
            duration: DURATION,
          });
          this.router.navigateByUrl(SOCIAL_LOGIN_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(SOCIAL_LOGIN_ERROR, CLOSE, { duration: DURATION }),
      });
  }

  getScopes(): string[] {
    const scopesFormGroup = this.socialLoginForm.get('scope') as FormArray;
    const scopes: string[] = [];
    for (const control of scopesFormGroup.controls) {
      scopes.push(control.value.scope);
    }
    return scopes;
  }

  updateSocialLogin() {
    this.socialLoginService
      .updateSocialLogin(
        this.uuid,
        this.socialLoginForm.controls.name.value,
        this.socialLoginForm.controls.description.value,
        this.socialLoginForm.controls.clientId.value,
        this.socialLoginForm.controls.clientSecret.value,
        this.socialLoginForm.controls.authorizationURL.value,
        this.socialLoginForm.controls.tokenURL.value,
        this.socialLoginForm.controls.introspectionURL.value,
        this.socialLoginForm.controls.baseURL.value,
        this.socialLoginForm.controls.profileURL.value,
        this.socialLoginForm.controls.revocationURL.value,
        this.getScopes(),
        this.socialLoginForm.controls.clientSecretToTokenEndpoint.value,
      )
      .subscribe({
        next: success => {
          this.snackBar.open(SOCIAL_LOGIN_UPDATED, CLOSE, {
            duration: DURATION,
          });
          this.router.navigateByUrl(SOCIAL_LOGIN_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(UPDATE_ERROR, CLOSE, { duration: DURATION }),
      });
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.socialLoginService.deleteSocialLogin(this.uuid).subscribe(
          next => {
            this.router.navigate(['social_login', 'list']);
          },
          error => {
            this.snackBar.open(DELETE_ERROR, CLOSE, { duration: DURATION });
          },
        );
      }
    });
  }
}
