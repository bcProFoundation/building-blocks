import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { throwError } from 'rxjs';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { AvatarDeletedEvent } from './avatar-deleted.event';
import { ForbiddenException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { BEARER, CONTENT_TYPE, APP_JSON } from '../../../constants/app-strings';
import { INVALID_TOKEN } from '../../../constants/messages';

export const COMMUNICATION_SERVER_DELETE_FILE = '/storage/v1/delete_file';

@EventsHandler(AvatarDeletedEvent)
export class AvatarDeletedHandler implements IEventHandler<AvatarDeletedEvent> {
  constructor(
    private readonly http: HttpService,
    private readonly tokenManager: ClientTokenManagerService,
  ) {}

  async handle(event: AvatarDeletedEvent) {
    const { profile, settings } = event;
    const requestUrl =
      settings.communicationServerUrl +
      COMMUNICATION_SERVER_DELETE_FILE +
      '/' +
      settings.uuid;
    const filename = `${profile.uuid}.jpeg`;
    const headers: { [key: string]: string } = {};
    headers[CONTENT_TYPE] = APP_JSON;
    this.tokenManager
      .getClientToken()
      .pipe(
        switchMap(token => {
          headers.authorization = BEARER + ' ' + token.accessToken;
          return this.http.post(requestUrl, { filename }, { headers }).pipe(
            catchError(error => {
              return this.tokenManager
                .deleteInvalidToken(token)
                .pipe(
                  switchMap(tokenDeleted =>
                    throwError(new ForbiddenException(INVALID_TOKEN)),
                  ),
                );
            }),
          );
        }),
        retry(3),
      )
      .subscribe({
        next: async success => {
          profile.picture = undefined;
          await profile.save();
        },
        error: error => {},
      });
  }
}
