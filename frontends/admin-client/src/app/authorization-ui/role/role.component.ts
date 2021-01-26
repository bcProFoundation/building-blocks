import { Component, OnInit } from '@angular/core';
import { RoleService } from './role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  CREATE_SUCCESSFUL,
  UPDATE_SUCCESSFUL,
  CLOSE,
  CREATE_ERROR,
  UPDATE_ERROR,
  DELETE_ERROR,
} from '../../constants/messages';
import { NEW_ID, DURATION } from '../../constants/common';
import { DeleteDialogComponent } from '../../shared-ui/delete-dialog/delete-dialog.component';

export const ROLE_LIST_ROUTE = '/role/list';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
})
export class RoleComponent implements OnInit {
  uuid: string;
  name: string;
  new = NEW_ID;

  roleForm = new FormGroup({
    roleName: new FormControl(),
  });

  constructor(
    private readonly roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.uuid = this.route.snapshot.params.id;
  }

  ngOnInit() {
    if (this.uuid && this.uuid !== this.new) {
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
          this.snackBar.open(CREATE_SUCCESSFUL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl(ROLE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(CREATE_ERROR, CLOSE, { duration: DURATION }),
      });
  }

  updateRole() {
    this.roleService
      .updateRole(this.uuid, this.roleForm.controls.roleName.value)
      .subscribe({
        next: success => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl(ROLE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(UPDATE_ERROR, CLOSE, { duration: DURATION }),
      });
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.deleteRole(this.name).subscribe(
          next => {
            this.router.navigate(['role', 'list']);
          },
          error => {
            this.snackBar.open(DELETE_ERROR, CLOSE, { duration: DURATION });
          },
        );
      }
    });
  }
}
