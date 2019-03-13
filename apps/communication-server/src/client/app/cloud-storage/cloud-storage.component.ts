import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CloudStorageService } from './cloud-storage.service';
import { NEW_ID } from '../constants/common';
import { MatSnackBar } from '@angular/material';
import { UPDATED_SUCCESSFUL, CLOSE } from '../constants/messages';

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

  cloudForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly cloudStorageService: CloudStorageService,
  ) {
    this.uuid = this.activatedRoute.snapshot.params.uuid;
    this.router.events
      .pipe(filter(route => route instanceof NavigationEnd))
      .subscribe((route: NavigationEnd) => {
        this.model = route.url.split('/')[1];
      });
  }
  updateValues: any = {};

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

    if (this.uuid === NEW_ID) this.uuid = undefined;
    else {
      this.subscribeGetCloud(this.uuid);
      this.cloudForm.controls.uuid.disable();
    }
  }

  updateCloudStorage() {
    this.cloudStorageService
      .updateCloudStorage(this.uuid, this.updateValues)
      .subscribe({
        next: res => {
          this.snackBar.open(UPDATED_SUCCESSFUL, CLOSE, { duration: 2500 });
        },
        error: err => {
          this.snackBar.open(err.messages, CLOSE, { duration: 2500 });
        },
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
        next: res => {
          this.router.navigateByUrl('/storage');
        },
        error: err => {},
      });
  }

  subscribeGetCloud(uuid) {
    this.cloudStorageService.getCloud(uuid).subscribe({
      next: (res: any) => {
        this.cloudForm.controls.name.setValue(res.name);
        this.cloudForm.controls.uuid.setValue(res.uuid);
        this.cloudForm.controls.version.setValue(res.version);
        this.cloudForm.controls.region.setValue(res.region);
        this.cloudForm.controls.endpoint.setValue(res.endpoint);
        this.cloudForm.controls.accessKey.setValue(res.accessKey);
        this.cloudForm.controls.secretKey.setValue(res.secretKey);
        this.cloudForm.controls.bucket.setValue(res.bucket);
        this.onChanges();
      },
      error: err => {},
    });
  }

  onChanges(): void {
    this.cloudForm.controls.name.valueChanges.subscribe(name => {
      this.updateValues.name = name;
    });
    this.cloudForm.controls.uuid.valueChanges.subscribe(uuid => {
      this.updateValues.uuid = uuid;
    });
    this.cloudForm.controls.version.valueChanges.subscribe(version => {
      this.updateValues.version = version;
    });
    this.cloudForm.controls.region.valueChanges.subscribe(region => {
      this.updateValues.region = region;
    });
    this.cloudForm.controls.endpoint.valueChanges.subscribe(endpoint => {
      this.updateValues.endpoint = endpoint;
    });
    this.cloudForm.controls.accessKey.valueChanges.subscribe(accessKey => {
      this.updateValues.accessKey = accessKey;
    });
    this.cloudForm.controls.secretKey.valueChanges.subscribe(secretKey => {
      this.updateValues.secretKey = secretKey;
    });
    this.cloudForm.controls.bucket.valueChanges.subscribe(bucket => {
      this.updateValues.bucket = bucket;
    });
  }
}
