import { Injectable } from '@angular/core';
import { StorageService } from '../../common/services/storage/storage.service';
import {
  STORAGE,
  ACCESS_TOKEN,
  COMMUNICATION_SERVER,
} from '../../constants/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CloudStorageService {
  headers: HttpHeaders;
  model = STORAGE;
  url: string;
  hideAccessKey = true;
  hideSecretKey = true;

  constructor(
    private readonly storageService: StorageService,
    private readonly http: HttpClient,
  ) {
    this.headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.storageService.getInfo(ACCESS_TOKEN),
    });
    this.url = this.storageService.getServiceURL(COMMUNICATION_SERVER);
  }

  getCloud(uuid) {
    const requestUrl = this.url + '/' + this.model + '/v1/get/' + uuid;
    return this.http.get(requestUrl, { headers: this.headers });
  }

  updateCloudStorage(
    uuid: string,
    version: string,
    name: string,
    region: string,
    endpoint: string,
    accessKey: string,
    secretKey: string,
    bucket: string,
    basePath: string,
  ) {
    const requestUrl = this.url + '/' + this.model + '/v1/modify/' + uuid;

    const updateCloudStorageCredentials = {
      version,
      name,
      region,
      endpoint,
      accessKey,
      secretKey,
      bucket,
      basePath,
    };

    return this.http.post(requestUrl, updateCloudStorageCredentials, {
      headers: this.headers,
    });
  }

  createCloudStorage(
    version: string,
    name: string,
    region: string,
    endpoint: string,
    accessKey: string,
    secretKey: string,
    bucket: string,
    basePath: string,
  ) {
    const cloudCredentials = {
      version,
      name,
      region,
      endpoint,
      accessKey,
      secretKey,
      bucket,
      basePath,
    };

    const requestUrl = this.url + '/' + this.model + '/v1/add';
    return this.http.post(requestUrl, cloudCredentials, {
      headers: this.headers,
    });
  }
}
