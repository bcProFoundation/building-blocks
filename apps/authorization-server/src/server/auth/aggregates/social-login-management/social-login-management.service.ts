import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  HttpService,
  NotFoundException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as uuidv4 from 'uuid/v4';
import { stringify } from 'querystring';
import { AxiosResponse } from 'axios';
import { OAuth2TokenRequest } from '../../controllers/social-login/oauth2-token-request.interface';
import { UserService } from '../../../user-management/entities/user/user.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { SocialLoginService } from '../../entities/social-login/social-login.service';
import { SocialLoginRemovedEvent } from '../../../auth/events/social-login-removed/social-login-removed.event';

@Injectable()
export class SocialLoginManagementService extends AggregateRoot {
  constructor(
    private readonly userService: UserService,
    private readonly socialLoginService: SocialLoginService,
    private readonly settingsService: ServerSettingsService,
    private readonly http: HttpService,
  ) {
    super();
  }
  requestTokenAndProfile(
    code: string,
    state: string,
    socialLogin: string,
    redirect: string = '/account',
    storedState: string,
    done: (...args) => any,
  ) {
    return from(this.socialLoginService.findOne({ uuid: socialLogin })).pipe(
      switchMap(data => {
        if (!data) return done(new UnauthorizedException());
        let confirmationURL = data.authorizationURL + '?client_id=';
        confirmationURL += data.clientId + '&response_type=code';

        // Create state with redirect Uri and
        // unique identifier and store it in request.
        const uuid = uuidv4();
        const stateData = JSON.stringify({ redirect, uuid });
        const builtState = Buffer.from(stateData).toString('base64');

        confirmationURL += '&state=' + builtState;
        confirmationURL += '&scope=' + data.scope.join('%20');

        return from(this.settingsService.find()).pipe(
          switchMap(settings => {
            const redirectURI =
              settings.issuerUrl + '/social_login/callback/' + data.uuid;
            confirmationURL +=
              '&redirect_uri=' + encodeURIComponent(redirectURI);
            confirmationURL += '&redirect=' + encodeURIComponent(redirect);

            if (!code) {
              // Redirect to confirmationURL
              return done(null, null, confirmationURL, {
                state: builtState,
              });
            } else if (code) {
              // Check incoming state and stored state
              if (!state || !storedState) {
                return done(new ForbiddenException());
              }

              const parsedStoredState = JSON.parse(
                Buffer.from(storedState, 'base64').toString(),
              );

              const parsedState = JSON.parse(
                Buffer.from(state, 'base64').toString(),
              );

              if (parsedStoredState.uuid !== parsedState.uuid) {
                return done(new ForbiddenException());
              }

              // Create payload for token request
              const payload: OAuth2TokenRequest = {
                code,
                grant_type: 'authorization_code',
                redirect_uri:
                  settings.issuerUrl + '/social_login/callback/' + data.uuid,
                client_id: data.clientId,
                scope: data.scope.join(' '),
              };

              // add client_secret to payload if specified
              if (data.clientSecretToTokenEndpoint) {
                payload.client_secret = data.clientSecret;
              }

              return this.http
                .post(data.tokenURL, stringify(payload), {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                })
                .pipe(
                  switchMap((tokenResponse: AxiosResponse) => {
                    const token = tokenResponse.data;
                    // TODO: OIDC and read id_token

                    // Check Profile Endpoint
                    return this.http
                      .get(data.profileURL, {
                        headers: {
                          authorization: 'Bearer ' + token.access_token,
                        },
                      })
                      .pipe(
                        switchMap((profileResponse: AxiosResponse) => {
                          const profile = profileResponse.data;
                          // Check Profile and set user.
                          // TODO: Store Upstream sub claim on local server
                          return from(
                            this.userService.findOne({
                              email: profile.email,
                            }),
                          ).pipe(
                            switchMap(user => {
                              if (!user) {
                                return from(
                                  this.userService.save({
                                    email: profile.email,
                                    name: profile.name,
                                  }),
                                );
                              }
                              return of(user);
                            }),
                          );
                        }),
                      );
                  }),
                );
            }
          }),
        );
      }),
    );
  }

  async removeSocialLogin(uuid: string, userUuid: string) {
    const socialLogin = await this.socialLoginService.findOne({ uuid });
    if (socialLogin) {
      await socialLogin.remove();
      this.apply(new SocialLoginRemovedEvent(userUuid, socialLogin));
    } else {
      throw new NotFoundException();
    }
  }
}
