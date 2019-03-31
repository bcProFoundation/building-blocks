import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CloudStorageService } from './cloud-storage.service';
import { NEW_ID } from '../constants/common';
import { MatSnackBar } from '@angular/material';
import {
  UPDATE_SUCCESSFUL,
  CLOSE,
  CREATE_SUCCESSFUL,
  CREATE_ERROR,
  UPDATE_ERROR,
} from '../constants/messages';

export const STORAGE_LIST_ROUTE = '/storage/list';

@Component({
  selector: 'app-cloud-storage',
  templateUrl: './cloud-storage.component.html',
  styleUrls: ['./cloud-storage.component.css'],
})
export class CloudStorageComponent implements OnInit {
  uuid: string;
  model: string;
  new: string = NEW_ID;
  version: string;
  region: string;
  hideClientSecret: boolean = true;
  name: string;
  hide: boolean;
  endpoint: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  hideAccessKey: boolean = true;
  hideSecretKey: boolean = true;

  cloudForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly cloudStorageService: CloudStorageService,
  ) {
    this.uuid = this.activatedRoute.snapshot.params.id;
    this.router.events
      .pipe(filter(route => route instanceof NavigationEnd))
      .subscribe((route: NavigationEnd) => {
        this.model = route.url.split('/')[1];
      });
  }

  ngOnInit() {
    this.cloudForm = this.formBuilder.group({
      name: '',
      uuid: '',
      version: '',
      region: '',
      endpoint: '',
      accessKey: '',
      secretKey: '',
      bucket: '',
    });

    if (this.uuid === NEW_ID) {
      this.uuid = undefined;
    } else {
      this.cloudForm.controls.uuid.disable();
      this.subscribeGetCloud(this.uuid);
    }
  }

  updateCloudStorage() {
    this.cloudStorageService
      .updateCloudStorage(
        this.uuid,
        this.cloudForm.controls.version.value,
        this.cloudForm.controls.name.value,
        this.cloudForm.controls.region.value,
        this.cloudForm.controls.endpoint.value,
        this.cloudForm.controls.accessKey.value,
        this.cloudForm.controls.secretKey.value,
        this.cloudForm.controls.bucket.value,
      )
      .subscribe({
        next: success => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: 2000 });
          this.router.navigateByUrl(STORAGE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(UPDATE_ERROR, CLOSE, { duration: 2000 }),
      });
  }

  createCloudStorage() {
    this.cloudStorageService
      .createCloudStorage(
        this.cloudForm.controls.version.value,
        this.cloudForm.controls.name.value,
        this.cloudForm.controls.region.value,
        this.cloudForm.controls.endpoint.value,
        this.cloudForm.controls.accessKey.value,
        this.cloudForm.controls.secretKey.value,
        this.cloudForm.controls.bucket.value,
      )
      .subscribe({
        next: success => {
          this.snackBar.open(CREATE_SUCCESSFUL, CLOSE, { duration: 2000 });
          this.router.navigateByUrl(STORAGE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(CREATE_ERROR, CLOSE, { duration: 2000 }),
      });
  }

  subscribeGetCloud(uuid) {
    this.cloudStorageService.getCloud(uuid).subscribe({
      next: (res: any) => {
        this.name = res.name;
        this.uuid = res.uuid;
        this.version = res.version;
        this.region = res.region;
        this.endpoint = res.endpoint;
        this.accessKey = res.accessKey;
        this.secretKey = res.secretKey;
        this.bucket = res.bucket;
        this.cloudForm.controls.name.setValue(res.name);
        this.cloudForm.controls.uuid.setValue(res.uuid);
        this.cloudForm.controls.version.setValue(res.version);
        this.cloudForm.controls.region.setValue(res.region);
        this.cloudForm.controls.endpoint.setValue(res.endpoint);
        this.cloudForm.controls.accessKey.setValue(res.accessKey);
        this.cloudForm.controls.secretKey.setValue(res.secretKey);
        this.cloudForm.controls.bucket.setValue(res.bucket);
      },
      error: err => {},
    });
  }
}
