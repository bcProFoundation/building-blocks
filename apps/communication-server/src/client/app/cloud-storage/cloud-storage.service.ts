import { Injectable } from '@angular/core';
import { StorageService } from '../common/storage.service';
import { APP_URL, STORAGE, ACCESS_TOKEN } from '../constants/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CloudStorageService {
  headers: HttpHeaders;

  constructor(
    private readonly storageService: StorageService,
    private readonly http: HttpClient,
  ) {
    this.headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.storageService.getInfo(ACCESS_TOKEN),
    });
  }
  model = STORAGE;
  url = this.storageService.getInfo(APP_URL);

  getCloud(uuid) {
    const requestUrl = this.url + '/' + this.model + '/v1/getOne/' + uuid;
    return this.http.get(requestUrl, { headers: this.headers });
  }

  updateCloudStorage(uuid, updateCloudStorageCredentials) {
    const requestUrl = this.url + '/' + this.model + '/v1/modify/' + uuid;

    return this.http.put(requestUrl, updateCloudStorageCredentials, {
      headers: this.headers,
    });
  }

  createCloudStorage(
    versionString,
    nameString,
    regionString,
    endpointString,
    accessKeyString,
    secretKeyString,
    bucketString,
  ) {
    const cloudCredentials = {
      version: versionString,
      name: nameString,
      region: regionString,
      endpoint: endpointString,
      accessKey: accessKeyString,
      secretKey: secretKeyString,
      bucket: bucketString,
    };

    const requestUrl = this.url + '/' + this.model + '/v1/add';
    return this.http.post(requestUrl, cloudCredentials, {
      headers: this.headers,
    });
  }
}
