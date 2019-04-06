import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NEW_ID } from '../../constants/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import {
  CREATE_SUCCESSFUL,
  CLOSE,
  CREATE_ERROR,
  DELETE_ERROR,
  DELETE_SUCCESSFUL,
} from '../../constants/messages';
import { ServiceTypeService } from './service-type.service';

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
    serviceTypeName: new FormControl(this.name),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly serviceTypeService: ServiceTypeService,
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
          this.snackBar.open(CREATE_SUCCESSFUL, CLOSE, { duration: 2000 });
          this.router.navigateByUrl(SERVICE_TYPE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(CREATE_ERROR, CLOSE, { duration: 2000 }),
      });
  }

  deleteServiceType() {
    this.serviceTypeService
      .deleteServiceType(this.serviceTypeForm.controls.serviceTypeName.value)
      .subscribe({
        next: success => {
          this.snackBar.open(DELETE_SUCCESSFUL, CLOSE, { duration: 2000 });
          this.router.navigateByUrl(SERVICE_TYPE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(DELETE_ERROR, CLOSE, { duration: 2000 }),
      });
  }
}
