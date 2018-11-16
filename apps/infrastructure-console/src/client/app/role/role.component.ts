import { Component, OnInit } from '@angular/core';
import { RoleService } from './role.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { CLIENT_ERROR, CLIENT_UPDATED } from '../constants/messages';
import { NEW_ID } from '../constants/common';

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
    private snackbar: MatSnackBar,
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
        next: (response: { name: string }) => {
          this.name = response.name;
        },
        error: error => {
          this.snackbar.open(CLIENT_ERROR, 'Close', { duration: 2500 });
        },
      });
  }

  updateRole() {
    this.roleService
      .updateRole(this.uuid, this.roleForm.controls.roleName.value)
      .subscribe({
        next: (response: { name: string }) => {
          this.name = response.name;
          this.snackbar.open(CLIENT_UPDATED, 'Close', { duration: 2500 });
        },
      });
  }
}
