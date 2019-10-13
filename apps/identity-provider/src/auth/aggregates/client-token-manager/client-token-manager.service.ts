import { ForbiddenException, Injectable, HttpService } from '@nestjs/common';
import { from, of, Observable, throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { stringify } from 'querystring';
import { TokenCache } from '../../entities/token-cache/token-cache.entity';
import { TokenCacheService } from '../../entities/token-cache/token-cache.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import {
  TEN_MINUTES_IN_SECONDS,
  CLIENT_CREDENTIALS,
  OPENID,
  APP_WWW_FORM_URLENCODED,
  REFRESH_TOKEN,
  BASIC,
  CONTENT_TYPE,
} from '../../../constants/app-strings';

@Injectable()
export class ClientTokenManagerService {
  constructor(
    private readonly tokenCache: TokenCacheService,
    private readonly settings: ServerSettingsService,
    private readonly http: HttpService,
  ) {}

  payloadMapper(res: AxiosResponse) {
    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
      exp: Math.floor(Date.now() / 1000) + Number(res.data.expires_in),
      scope: res.data.scope.split(' '),
    };
  }

  getClientToken(): Observable<TokenCache> {
    const settings = from(this.settings.find());
    return this.getExistingToken(settings).pipe(
      switchMap(token => {
        if (!token) {
          return this.getNewToken(settings);
        }
        const epochNow = Math.floor(new Date().valueOf() / 1000);
        if (token.exp - TEN_MINUTES_IN_SECONDS > epochNow) {
          return of(token);
        }
        return this.refreshExpiredToken(settings, token);
      }),
    );
  }

  getExistingToken(settings$: Observable<ServerSettings>) {
    return settings$.pipe(
      switchMap(settings => {
        if (!settings.clientTokenUuid) {
          return of(null);
        }
        return from(
          this.tokenCache.findOne({ uuid: settings.clientTokenUuid }),
        );
      }),
    );
  }

  getNewToken(settings$: Observable<ServerSettings>) {
    const headers = {};
    headers[CONTENT_TYPE] = APP_WWW_FORM_URLENCODED;
    return settings$.pipe(
      switchMap(settings => {
        const payload = {
          client_id: settings.clientId,
          client_secret: settings.clientSecret,
          redirect_uri: settings.callbackURLs[0],
          grant_type: CLIENT_CREDENTIALS,
          scope: OPENID,
        };

        return this.http.post(settings.tokenURL, stringify(payload), {
          headers,
        });
      }),
      map(this.payloadMapper),
      switchMap(token => {
        return this.saveNewToken(settings$, token);
      }),
    );
  }

  refreshExpiredToken(
    settings$: Observable<ServerSettings>,
    token: TokenCache,
  ) {
    const headers = {};
    headers[CONTENT_TYPE] = APP_WWW_FORM_URLENCODED;
    return settings$.pipe(
      switchMap(settings => {
        const payload = {
          client_id: settings.clientId,
          refresh_token: token.refreshToken,
          redirect_uri: settings.callbackURLs[0],
          grant_type: REFRESH_TOKEN,
        };

        return this.http
          .post(settings.tokenURL, stringify(payload), { headers })
          .pipe(
            map(this.payloadMapper),
            switchMap(tokenPayload => {
              this.revokeToken(settings$, token);
              return from(
                this.tokenCache.findOne({ uuid: settings.clientTokenUuid }),
              ).pipe(
                switchMap(savedToken => {
                  if (!savedToken) return throwError(new ForbiddenException());
                  return this.updateToken(savedToken, tokenPayload);
                }),
              );
            }),
          );
      }),
    );
  }

  revokeToken(settings$: Observable<ServerSettings>, token: TokenCache) {
    settings$
      .pipe(
        switchMap(settings => {
          const credentials = Buffer.from(
            settings.clientId + ':' + settings.clientSecret,
          ).toString('base64');
          return this.http.post(
            settings.revocationURL,
            { token: token.accessToken },
            { headers: { authorization: `${BASIC} ${credentials}` } },
          );
        }),
      )
      .subscribe({
        next: success => {},
        error: error => {},
      });
  }

  updateToken(token: TokenCache, tokenPayload) {
    Object.assign(token, tokenPayload);
    token.exp = tokenPayload.exp;
    token
      .save()
      .then(success => {})
      .catch(error => {});
    return of(token);
  }

  saveNewToken(settings$: Observable<ServerSettings>, tokenPayload) {
    const saveToken = new TokenCache();
    saveToken.accessToken = tokenPayload.accessToken;
    saveToken.refreshToken = tokenPayload.refreshToken;
    saveToken.exp = tokenPayload.exp;
    saveToken.scope = tokenPayload.scope;

    return from(saveToken.save()).pipe(
      switchMap(token => {
        return settings$.pipe(
          switchMap(settings => {
            settings.clientTokenUuid = token.uuid;
            settings
              .save()
              .then(success => {})
              .catch(error => {});
            return of(token);
          }),
        );
      }),
    );
  }

  deleteInvalidToken(token: TokenCache) {
    return from(this.settings.find()).pipe(
      switchMap(settings => {
        settings.clientTokenUuid = undefined;
        return from(settings.save());
      }),
      switchMap(settingsUpdated => {
        return from(token.remove());
      }),
    );
  }
}
