import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { from, of } from 'rxjs';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { switchMap, map } from 'rxjs/operators';
import { COMMUNICATION_SERVER } from '../../../constants/app-strings';

@Injectable()
export class UploadAvatarMetaDataService {
  authorizationHeader;
  constructor(
    private readonly serverSettingsService: ServerSettingsService,
    private readonly http: HttpService,
  ) {}
  uploadNewAvatarMetaData(accessToken: string) {
    let cloudStorage, communicationServerUrl;
    this.authorizationHeader = {
      Authorization: 'Bearer ' + accessToken,
    };
    return from(this.serverSettingsService.find()).pipe(
      switchMap(settings => {
        cloudStorage = settings.cloudStorageSettings;
        return this.http.get(settings.authServerURL + '/info');
      }),
      map(authServerInfo => {
        for (const serviceUrl of authServerInfo.data.services) {
          if (serviceUrl.type === COMMUNICATION_SERVER) {
            communicationServerUrl = serviceUrl.url;
            return serviceUrl.url;
          }
        }
      }),
      switchMap((url: any) => {
        return this.http
          .get(url + '/storage/v1/get/' + cloudStorage, {
            headers: this.authorizationHeader,
          })
          .pipe(
            map(resData => {
              const fullData = resData.data;
              delete fullData.accessKey;
              delete fullData.secretKey;
              return fullData;
            }),
          );
      }),
      switchMap((settings: any) => {
        settings.communicationServerUrl = communicationServerUrl;
        return of(settings);
      }),
    );
  }
}
