import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { NEW_ID } from '../constants/common';
import { UserService } from './user.service';
import { CLIENT_CREATED, CLIENT_ERROR } from '../constants/messages';
import { CreateUserResponse } from '../interfaces/user-response.interface';
import { RoleService } from '../role/role.service';

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
  roles: string[] = [];
  hide: boolean = true;

  userForm: FormGroup = new FormGroup({
    fullName: new FormControl(this.fullName),
    uuid: new FormControl(this.uuid),
    userPassword: new FormControl(this.userPassword),
    userRole: new FormControl(''),
    userEmail: new FormControl(this.userEmail),
    isDisabled: new FormControl(this.isDisabled),
    userPhone: new FormControl(this.userPhone),
  });

  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
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
        this.userForm.controls.userRole.value,
      )
      .subscribe({
        next: (response: CreateUserResponse) => {
          this.fullName = response.name;
          this.userPassword = response.userPassword;
          this.uuid = response.uuid;
          this.snackBar.open(CLIENT_CREATED, 'Close', { duration: 2500 });
        },
        error: error => {
          this.snackBar.open(CLIENT_ERROR, 'Close', { duration: 2500 });
        },
      });
  }

  updateUser() {
    this.userService
      .updateUser(
        this.uuid,
        this.userForm.controls.fullName.value,
        this.userForm.controls.userRole.value,
        this.userForm.controls.userPassword.value,
      )
      .subscribe({
        next: (response: { name: string }) => {
          this.fullName = response.name;
        },
        error: error => {
          this.snackBar.open(error.error.message, 'Close', { duration: 2500 });
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
}
