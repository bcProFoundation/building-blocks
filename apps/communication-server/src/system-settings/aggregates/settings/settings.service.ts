import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ServerSettingsService } from '../../entities/server-settings/server-settings.service';
import { ServerSettings } from '../../entities/server-settings/server-settings.entity';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class SettingsService {
  constructor(
    private readonly serverSettingsService: ServerSettingsService,
    private readonly http: HttpService,
  ) {}

  find(): Observable<ServerSettings> {
    const settings = this.serverSettingsService.find();
    return from(settings);
  }

  update(query, params) {
    return this.find().pipe(
      switchMap(settings => {
        let baseEncodedCred: string;
        if (settings.clientSecret !== params.clientSecret) {
          baseEncodedCred = Buffer.from(
            settings.clientId + ':' + params.clientSecret,
          ).toString('base64');
          return this.http
            .post(
              settings.authServerURL + '/client/v1/verify_changed_secret',
              null,
              { headers: { Authorization: 'Basic ' + baseEncodedCred } },
            )
            .pipe(
              catchError((err, caught) => {
                return of(err);
              }),
              switchMap(data => {
                if (data.response && data.response.status > 299) {
                  // TODO: notify error
                  return of({});
                } else {
                  return from(this.serverSettingsService.update(query, params));
                }
              }),
            );
        } else {
          return from(this.serverSettingsService.update(query, params));
        }
      }),
    );
  }
}
