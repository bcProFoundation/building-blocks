import { Component, OnInit } from '@angular/core';
import { RoleService } from './role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import {
  CREATE_SUCCESSFUL,
  UPDATE_SUCCESSFUL,
  CLOSE,
  CREATE_ERROR,
  UPDATE_ERROR,
} from '../../constants/messages';
import { NEW_ID } from '../../constants/common';

export const ROLE_LIST_ROUTE = '/role/list';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
})
export class RoleComponent implements OnInit {
  uuid: string;
  name: string;

  roleForm = new FormGroup({
    roleName: new FormControl(this.name),
  });

  constructor(
    private readonly roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.uuid = this.route.snapshot.params.id;
  }

  ngOnInit() {
    if (this.uuid !== NEW_ID) {
      this.roleService.getRole(this.uuid).subscribe({
        next: response => {
          this.name = response.name;
          this.roleForm.controls.roleName.setValue(response.name);
        },
      });
    }
  }

  createRole() {
    this.roleService
      .createRole(this.roleForm.controls.roleName.value)
      .subscribe({
        next: success => {
          this.snackBar.open(CREATE_SUCCESSFUL, CLOSE, { duration: 2000 });
          this.router.navigateByUrl(ROLE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(CREATE_ERROR, CLOSE, { duration: 2000 }),
      });
  }

  updateRole() {
    this.roleService
      .updateRole(this.uuid, this.roleForm.controls.roleName.value)
      .subscribe({
        next: success => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: 2000 });
          this.router.navigateByUrl(ROLE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(UPDATE_ERROR, CLOSE, { duration: 2000 }),
      });
  }
}
