import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { NEW_ID, DURATION } from '../../constants/common';
import { CloudStorageService } from './cloud-storage.service';
import {
  UPDATE_SUCCESSFUL,
  CLOSE,
  CREATE_SUCCESSFUL,
  CREATE_ERROR,
  UPDATE_ERROR,
  DELETE_ERROR,
} from '../../constants/messages';
import { DeleteDialogComponent } from '../../shared-ui/delete-dialog/delete-dialog.component';

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
  basePath: string;

  cloudForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly cloudStorageService: CloudStorageService,
    private readonly dialog: MatDialog,
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
      basePath: '',
    });

    if (this.uuid && this.uuid === this.new) {
      this.uuid = undefined;
      this.cloudForm.controls.secretKey.setValidators([Validators.required]);
      this.cloudForm.controls.accessKey.setValidators([Validators.required]);
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
        this.cloudForm.controls.basePath.value,
      )
      .subscribe({
        next: success => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl(STORAGE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(UPDATE_ERROR, CLOSE, { duration: DURATION }),
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
        this.cloudForm.controls.basePath.value,
      )
      .subscribe({
        next: success => {
          this.snackBar.open(CREATE_SUCCESSFUL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl(STORAGE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(CREATE_ERROR, CLOSE, { duration: DURATION }),
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
        this.basePath = res.basePath;
        this.cloudForm.controls.name.setValue(res.name);
        this.cloudForm.controls.uuid.setValue(res.uuid);
        this.cloudForm.controls.version.setValue(res.version);
        this.cloudForm.controls.region.setValue(res.region);
        this.cloudForm.controls.endpoint.setValue(res.endpoint);
        this.cloudForm.controls.accessKey.setValue(res.accessKey);
        this.cloudForm.controls.secretKey.setValue(res.secretKey);
        this.cloudForm.controls.bucket.setValue(res.bucket);
        this.cloudForm.controls.basePath.setValue(res.basePath);
      },
      error: err => {},
    });
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cloudStorageService.deleteStorage(this.uuid).subscribe(
          next => {
            this.router.navigate(['storage', 'list']);
          },
          error => {
            this.snackBar.open(DELETE_ERROR, CLOSE, { duration: DURATION });
          },
        );
      }
    });
  }
}
