import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotImplementedException,
  HttpService,
} from '@nestjs/common';
import { ServerSettingsService } from '../../system-settings/entities/server-settings/server-settings.service';
import { TokenCache } from '../../auth/entities/token-cache/token-cache.entity';
import { TokenCacheService } from '../../auth/entities/token-cache/token-cache.service';
import { TOKEN } from '../../constants/app-strings';
import { switchMap, retry } from 'rxjs/operators';
import { of, from, throwError } from 'rxjs';
import * as Express from 'express';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly settingsService: ServerSettingsService,
    private readonly tokenCacheService: TokenCacheService,
    private readonly http: HttpService,
  ) {}
  canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const accessToken = this.getAccessToken(req);
    return from(this.tokenCacheService.findOne({ accessToken })).pipe(
      switchMap(cachedToken => {
        if (!cachedToken) {
          return this.introspectToken(accessToken, req);
        } else if (Math.floor(new Date().getTime() / 1000) < cachedToken.exp) {
          req[TOKEN] = cachedToken;
          return of(true);
        } else if (!cachedToken.refreshToken) {
          this.deleteToken(cachedToken);
          return this.introspectToken(accessToken, req);
        }
      }),
    );
  }

  introspectToken(accessToken: string, req: Express.Request) {
    return from(this.settingsService.find()).pipe(
      switchMap(settings => {
        if (!settings) {
          return throwError(new NotImplementedException());
        }
        const baseEncodedCred = Buffer.from(
          settings.clientId + ':' + settings.clientSecret,
        ).toString('base64');
        return this.http
          .post(
            settings.introspectionURL,
            { token: accessToken },
            { headers: { Authorization: 'Basic ' + baseEncodedCred } },
          )
          .pipe(
            retry(3),
            switchMap(response => {
              if (response.data.active) {
                return from(this.cacheToken(response.data, accessToken)).pipe(
                  switchMap(cachedToken => {
                    req[TOKEN] = cachedToken;
                    return of(cachedToken.active);
                  }),
                );
              }
              return of(false);
            }),
          );
      }),
    );
  }

  getAccessToken(request) {
    if (!request.headers.authorization) {
      if (!request.query.access_token) return null;
    }
    return (
      request.query.access_token ||
      request.headers.authorization.split(' ')[1] ||
      null
    );
  }

  cacheToken(introspectedToken: any, accessToken: string): Promise<TokenCache> {
    introspectedToken.accessToken = accessToken;
    introspectedToken.clientId = introspectedToken.client_id;
    introspectedToken.trustedClient = introspectedToken.trusted_client;
    return this.tokenCacheService.save(introspectedToken);
  }

  deleteToken(cachedToken: TokenCache) {
    from(this.settingsService.find())
      .pipe(
        switchMap(settings => {
          return from(
            this.tokenCacheService.deleteMany({
              uuid: { $ne: settings.clientTokenUuid },
              accessToken: cachedToken.accessToken,
            }),
          );
        }),
      )
      .subscribe({
        next: success => {},
        error: error => {},
      });
  }
}
