import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { map, debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NEW_ID, DURATION } from '../../constants/common';
import { ListingService } from '../../shared-ui/listing/listing.service';
import { ListResponse } from '../../shared-ui/listing/listing-datasource';
import {
  FETCH_ERROR,
  CLOSE,
  CREATE_SUCCESSFUL,
  UPDATE_SUCCESSFUL,
  CREATE_ERROR,
  UPDATE_ERROR,
  DELETE_ERROR,
} from '../../constants/messages';
import { ServiceService } from './service.service';
import { DeleteDialogComponent } from '../../shared-ui/delete-dialog/delete-dialog.component';

export const SERVICE_LIST_ROUTE = '/service/list';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
})
export class ServiceComponent implements OnInit {
  uuid: string;
  name: string;
  type: string;
  clientId: string;
  serviceURL: string;
  serviceTypes: Observable<{ name: string; uuid: string }[]>;
  serviceTypeSearch: string = '';
  clientList: { clientId: string; name: string }[];
  serviceForm: FormGroup = new FormGroup({
    name: new FormControl(),
    type: new FormControl(),
    clientId: new FormControl(),
    serviceURL: new FormControl(),
  });
  new = NEW_ID;

  constructor(
    private readonly serviceService: ServiceService,
    private readonly listService: ListingService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {
    this.uuid = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.serviceService.getClientList().subscribe({
      next: (response: { clientId: string; name: string }[]) => {
        this.clientList = response;
      },
      error: error => {
        this.snackBar.open(FETCH_ERROR, CLOSE, { duration: DURATION });
      },
    });

    if (this.uuid !== this.new) {
      this.serviceService.getService(this.uuid).subscribe({
        next: response => {
          this.name = response.name;
          this.type = response.type;
          this.serviceURL = response.serviceURL;
          this.clientId = response.clientId;
          this.serviceForm.controls.name.setValue(this.name);
          this.serviceForm.controls.type.setValue(this.type);
          this.serviceForm.controls.serviceURL.setValue(this.serviceURL);
          this.serviceForm.controls.clientId.setValue(this.clientId);
          this.serviceForm.controls.clientId.disable();
        },
        error: error => {
          this.snackBar.open(FETCH_ERROR, CLOSE, { duration: DURATION });
        },
      });
    }
  }

  searchKeyUp() {
    this.serviceTypeSearch = this.serviceForm.controls.type.value;
    this.subscribeListServiceTypes();
  }

  subscribeListServiceTypes() {
    this.serviceTypes = this.listService
      .findModels('service_type', this.serviceTypeSearch)
      .pipe(
        map((resp: ListResponse) => resp.docs),
        debounceTime(1000),
      );
  }

  registerService() {
    this.serviceService
      .createService(
        this.serviceForm.controls.name.value,
        this.serviceForm.controls.type.value,
        this.serviceForm.controls.clientId.value,
        this.serviceForm.controls.serviceURL.value,
      )
      .subscribe({
        next: success => {
          this.snackBar.open(CREATE_SUCCESSFUL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl(SERVICE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(CREATE_ERROR, CLOSE, { duration: DURATION }),
      });
  }

  modifyService() {
    this.serviceService
      .modifyService(
        this.serviceForm.controls.clientId.value,
        this.serviceForm.controls.name.value,
        this.serviceForm.controls.type.value,
        this.serviceForm.controls.serviceURL.value,
      )
      .subscribe({
        next: success => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl(SERVICE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(UPDATE_ERROR, CLOSE, { duration: DURATION }),
      });
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serviceService.deleteService(this.clientId).subscribe(
          next => {
            this.router.navigate(['service', 'list']);
          },
          error => {
            this.snackBar.open(DELETE_ERROR, CLOSE, { duration: DURATION });
          },
        );
      }
    });
  }
}
