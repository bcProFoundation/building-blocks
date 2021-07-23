import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CommandBus } from '@nestjs/cqrs';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { stringify } from 'querystring';
import { OAuth2TokenRequest } from '../../../auth/controllers/social-login/oauth2-token-request.interface';
import { i18n } from '../../../i18n/i18n.config';
import { UserService } from '../../../user-management/entities/user/user.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { SocialLoginService } from '../../entities/social-login/social-login.service';
import { SignUpSocialLoginUserCommand } from '../../commands/sign-up-social-login-user/sign-up-social-login-user.command';
import { IDTokenClaims } from '../../middlewares/interfaces';

@Injectable()
export class SocialLoginCallbackService {
  constructor(
    private readonly userService: UserService,
    private readonly socialLoginService: SocialLoginService,
    private readonly settingsService: ServerSettingsService,
    private readonly http: HttpService,
    private readonly commandBus: CommandBus,
  ) {}

  requestTokenAndProfile(
    code: string,
    state: string,
    socialLogin: string,
    redirect: string = '/account',
    storedState: string,
    done: (...args) => any,
  ) {
    return from(this.socialLoginService.findOne({ uuid: socialLogin })).pipe(
      switchMap(socialLoginObject => {
        if (!socialLoginObject) return done(new UnauthorizedException());
        let confirmationURL =
          socialLoginObject.authorizationURL + '?client_id=';
        confirmationURL += socialLoginObject.clientId + '&response_type=code';

        // Create state with redirect Uri and
        // unique identifier and store it in request.
        const uuid = uuidv4();
        const stateData = JSON.stringify({ redirect, uuid });
        const builtState = Buffer.from(stateData).toString('base64');

        confirmationURL += '&state=' + builtState;
        confirmationURL += '&scope=' + socialLoginObject.scope.join('%20');

        return from(this.settingsService.find()).pipe(
          switchMap(settings => {
            const redirectURI =
              settings.issuerUrl +
              '/social_login/callback/' +
              socialLoginObject.uuid;
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
                  settings.issuerUrl +
                  '/social_login/callback/' +
                  socialLoginObject.uuid,
                client_id: socialLoginObject.clientId,
                scope: socialLoginObject.scope.join(' '),
              };

              // add client_secret to payload if specified
              if (socialLoginObject.clientSecretToTokenEndpoint) {
                payload.client_secret = socialLoginObject.clientSecret;
              }

              return this.http
                .post(socialLoginObject.tokenURL, stringify(payload), {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                })
                .pipe(
                  switchMap(
                    (tokenResponse: { data: { access_token: string } }) => {
                      const token = tokenResponse.data;
                      // TODO: OIDC and read id_token

                      // Check Profile Endpoint
                      return this.http
                        .get(socialLoginObject.profileURL, {
                          headers: {
                            authorization: 'Bearer ' + token.access_token,
                          },
                        })
                        .pipe(
                          switchMap(
                            (profileResponse: { data: { email: string } }) => {
                              const profile = profileResponse?.data;
                              if (!profile?.email) {
                                return done(
                                  new ForbiddenException(
                                    i18n.__('Invalid User'),
                                  ),
                                );
                              }
                              // Check Profile and set user.
                              // TODO: Store Upstream sub claim on local server
                              return from(
                                this.userService.findOne({
                                  email: profile.email,
                                }),
                              ).pipe(
                                switchMap(user => {
                                  if (!user) {
                                    if (settings.disableSignup) {
                                      return done(
                                        new UnauthorizedException({
                                          message: i18n.__('Signup Disabled'),
                                        }),
                                      );
                                    }

                                    return from(
                                      this.signUpSocialLoginUser(
                                        profile,
                                        socialLogin,
                                      ),
                                    );
                                  }

                                  if (user.disabled) {
                                    return done(
                                      new ForbiddenException(
                                        i18n.__('User Disabled'),
                                      ),
                                    );
                                  }

                                  if (user.email !== profile?.email) {
                                  }

                                  return of(user);
                                }),
                              );
                            },
                          ),
                        );
                    },
                  ),
                );
            }
          }),
        );
      }),
    );
  }

  async signUpSocialLoginUser(profile: IDTokenClaims, socialLogin: string) {
    return await this.commandBus.execute(
      new SignUpSocialLoginUserCommand(
        profile.email,
        profile.name,
        socialLogin,
        profile.email_verified,
      ),
    );
  }
}
