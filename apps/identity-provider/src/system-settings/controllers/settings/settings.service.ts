import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { BASIC } from '../../../constants/app-strings';

@Injectable()
export class SettingsService {
  constructor(
    private readonly serverSettingsService: ServerSettingsService,
    private readonly tokenService: TokenCacheService,
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

  async clearTokenCache() {
    this.find()
      .pipe(
        switchMap(settings => {
          // Revoke Bearer Tokens with Refresh Tokens
          this.revokeAndDeleteTokens(settings)
            .then(success => {})
            .catch(fail => {});
          settings.clientTokenUuid = undefined;
          return from(settings.save());
        }),
      )
      .subscribe({
        next: success => {},
        error: error => {},
      });
    return await this.tokenService.deleteMany({
      refreshToken: { $exists: false, $not: { $size: 0 } },
    });
  }

  async revokeAndDeleteTokens(settings: ServerSettings) {
    const tokens = await this.tokenService.find({
      refreshToken: { $exists: true },
    });

    for (const token of tokens) {
      token
        .remove()
        .then(success => {})
        .catch(fail => {});
      const credentials = Buffer.from(
        settings.clientId + ':' + settings.clientSecret,
      ).toString('base64');
      this.http
        .post(
          settings.revocationURL,
          { token: token.accessToken },
          { headers: { authorization: `${BASIC} ${credentials}` } },
        )
        .subscribe({
          next: success => {},
          error: error => {},
        });
    }
  }
}
