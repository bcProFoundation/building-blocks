import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NEW_ID, DURATION } from '../../constants/common';
import {
  CREATE_SUCCESSFUL,
  CLOSE,
  CREATE_ERROR,
  DELETE_ERROR,
} from '../../constants/messages';
import { ServiceTypeService } from './service-type.service';
import { DeleteDialogComponent } from '../../shared-ui/delete-dialog/delete-dialog.component';

export const SERVICE_TYPE_LIST_ROUTE = '/service_type/list';

@Component({
  selector: 'app-service-type',
  templateUrl: './service-type.component.html',
  styleUrls: ['./service-type.component.css'],
})
export class ServiceTypeComponent implements OnInit {
  uuid: string;
  name: string;
  serviceTypeForm = new FormGroup({
    serviceTypeName: new FormControl(),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly serviceTypeService: ServiceTypeService,
    private readonly dialog: MatDialog,
  ) {
    this.uuid = this.route.snapshot.params.id;
  }

  ngOnInit() {
    if (this.uuid !== NEW_ID) {
      this.serviceTypeService.getServiceType(this.uuid).subscribe({
        next: response => {
          this.name = response.name;
          this.serviceTypeForm.controls.serviceTypeName.setValue(response.name);
          if (this.name) {
            this.serviceTypeForm.controls.serviceTypeName.disable();
          }
        },
        error: error => {},
      });
    }
  }

  createServiceType() {
    this.serviceTypeService
      .createServiceType(this.serviceTypeForm.controls.serviceTypeName.value)
      .subscribe({
        next: success => {
          this.snackBar.open(CREATE_SUCCESSFUL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl(SERVICE_TYPE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(CREATE_ERROR, CLOSE, { duration: DURATION }),
      });
  }

  deleteServiceType() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serviceTypeService.deleteServiceType(this.name).subscribe(
          next => {
            this.router.navigate(['service_type', 'list']);
          },
          error => {
            this.snackBar.open(DELETE_ERROR, CLOSE, { duration: DURATION });
          },
        );
      }
    });
  }
}
