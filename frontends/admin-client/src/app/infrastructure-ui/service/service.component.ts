import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ServiceService } from './service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { NEW_ID } from '../../constants/common';
import { map, debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ListingService } from '../../shared-ui/listing/listing.service';
import { ListResponse } from '../../shared-ui/listing/listing-datasource';
import {
  FETCH_ERROR,
  CLOSE,
  CREATE_SUCCESSFUL,
  UPDATE_SUCCESSFUL,
  CREATE_ERROR,
  UPDATE_ERROR,
} from '../../constants/messages';

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
    name: new FormControl(this.name),
    type: new FormControl(this.type),
    clientId: new FormControl(this.clientId),
    serviceURL: new FormControl(this.serviceURL),
  });

  constructor(
    private readonly serviceService: ServiceService,
    private readonly listService: ListingService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
  ) {
    this.uuid = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.serviceService.getClientList().subscribe({
      next: (response: { clientId: string; name: string }[]) => {
        this.clientList = response;
      },
      error: error => {
        this.snackBar.open(FETCH_ERROR, CLOSE, { duration: 2000 });
      },
    });

    if (this.uuid !== NEW_ID) {
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
          this.snackBar.open(FETCH_ERROR, CLOSE, { duration: 2000 });
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
          this.snackBar.open(CREATE_SUCCESSFUL, CLOSE, { duration: 2000 });
          this.router.navigateByUrl(SERVICE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(CREATE_ERROR, CLOSE, { duration: 2000 }),
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
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: 2000 });
          this.router.navigateByUrl(SERVICE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(UPDATE_ERROR, CLOSE, { duration: 2000 }),
      });
  }
}
