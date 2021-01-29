import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OAuthService } from 'angular-oauth2-oidc';
import { NEW_ID, DURATION } from '../../constants/common';
import { UserService } from './user.service';
import {
  CREATE_SUCCESSFUL,
  CLOSE,
  CREATE_ERROR,
  UPDATE_SUCCESSFUL,
  UPDATE_ERROR,
  DELETE_ERROR,
} from '../../constants/messages';
import { RoleService } from '../role/role.service';
import { ISSUER_URL } from '../../constants/storage';
import { DeleteDialogComponent } from '../../shared-ui/delete-dialog/delete-dialog.component';

export const USER_LIST_ROUTE = '/user/list';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  uuid: string;
  userId: string;
  fullName: string;
  isDisabled: boolean;
  enable2fa: boolean;
  userEmail: string;
  userPhone: number;
  userPassword: string;
  enablePasswordLess: boolean;
  roles: string[] = [];
  hide: boolean = true;

  userForm: FormGroup = new FormGroup({
    fullName: new FormControl(),
    uuid: new FormControl(),
    userPassword: new FormControl(),
    userRole: new FormControl(),
    userEmail: new FormControl(),
    isDisabled: new FormControl(),
    userPhone: new FormControl(),
  });
  new = NEW_ID;

  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private readonly oauth2: OAuthService,
    private dialog: MatDialog,
  ) {
    this.uuid =
      this.route.snapshot.params.id === NEW_ID
        ? null
        : this.route.snapshot.params.id;
  }

  ngOnInit() {
    if (this.uuid && this.uuid !== NEW_ID) {
      this.subscribeGetUser(this.uuid);
    }
    this.subscribeGetRoles();
  }

  subscribeGetUser(uuid: string) {
    this.userService.getUser(uuid).subscribe({
      next: response => {
        if (response) {
          this.enablePasswordLess = response.enablePasswordLess;
          this.populateUserForm(response);
        }
      },
    });
  }

  subscribeGetRoles() {
    this.roleService.getRoles().subscribe({
      next: (response: any) => {
        if (response) {
          response.map(role => {
            this.roles.push(role.name);
          });
        }
      },
    });
  }

  createUser() {
    this.userService
      .createUser(
        this.userForm.controls.fullName.value,
        this.userForm.controls.userEmail.value,
        this.userForm.controls.userPhone.value,
        this.userForm.controls.userPassword.value,
        this.userForm.controls.userRole.value || [],
      )
      .subscribe({
        next: success => {
          this.snackBar.open(CREATE_SUCCESSFUL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl(USER_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(CREATE_ERROR, CLOSE, { duration: DURATION }),
      });
  }

  updateUser() {
    this.userService
      .updateUser(
        this.uuid,
        this.userForm.controls.fullName.value,
        this.userForm.controls.userRole.value,
        this.userForm.controls.userPassword.value,
        this.userForm.controls.isDisabled.value,
      )
      .subscribe({
        next: success => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl(USER_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(UPDATE_ERROR, CLOSE, { duration: DURATION }),
      });
  }

  manageAuthUser() {
    let url = localStorage.getItem(ISSUER_URL);
    url += '/account/keys/' + this.uuid;
    url += '?access_token=' + this.oauth2.getAccessToken();
    window.location.href = url;
  }

  enablePasswordLessLogin() {
    this.userService.enablePasswordLessLogin(this.uuid).subscribe({
      next: success => {
        this.enablePasswordLess = true;
        this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: DURATION });
      },
      error: ({ error }) => {
        this.snackBar.open(error.message, CLOSE, { duration: DURATION });
      },
    });
  }

  disablePasswordLessLogin() {
    this.userService.disablePasswordLessLogin(this.uuid).subscribe({
      next: success => {
        this.enablePasswordLess = false;
        this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: DURATION });
      },
      error: ({ error }) => {
        this.snackBar.open(error.message, CLOSE, { duration: DURATION });
      },
    });
  }

  populateUserForm(user) {
    this.fullName = user.name;
    this.userEmail = user.email;
    this.uuid = user.uuid;
    this.userForm.controls.fullName.setValue(user.name);
    this.userForm.controls.isDisabled.setValue(user.disabled);
    this.userForm.controls.userPhone.setValue(user.phone);
    this.userForm.controls.userEmail.setValue(user.email);
    this.userForm.controls.userRole.setValue(user.roles);
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(this.uuid).subscribe(
          next => {
            this.router.navigate(['user', 'list']);
          },
          error => {
            this.snackBar.open(DELETE_ERROR, CLOSE, { duration: DURATION });
          },
        );
      }
    });
  }
}
