import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { HttpService, ForbiddenException } from '@nestjs/common';
import * as FormData from 'form-data';
import { NewAvatarUploadedEvent } from './new-avatar-uploaded.event';
import { PUBLIC, BEARER } from '../../../constants/app-strings';
import { Profile } from '../../../profile-management/entities/profile/profile.entity';
import { ProfileService } from '../../../profile-management/entities/profile/profile.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { INVALID_TOKEN } from '../../../constants/messages';

@EventsHandler(NewAvatarUploadedEvent)
export class NewAvatarUploadedHandler
  implements IEventHandler<NewAvatarUploadedEvent> {
  constructor(
    private readonly http: HttpService,
    private readonly profileService: ProfileService,
    private readonly tokenManager: ClientTokenManagerService,
  ) {}

  handle(event: NewAvatarUploadedEvent) {
    const requestUrl =
      event.cloudBucketCredentials.communicationServerUrl +
      '/storage/v1/upload_file/' +
      event.cloudBucketCredentials.uuid;

    const uploadFile: FormData = new FormData();
    uploadFile.append('file', event.file.buffer, {
      filename: event.file.originalname,
      contentType: event.file.mimetype,
    });
    uploadFile.append('permission', PUBLIC);
    const headers: { [key: string]: string } = uploadFile.getHeaders();
    this.tokenManager
      .getClientToken()
      .pipe(
        switchMap(token => {
          headers.authorization = BEARER + ' ' + token.accessToken;
          return this.http.post(requestUrl, uploadFile, { headers }).pipe(
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
        next: async data => {
          let profile: Profile = await this.profileService.findOne({
            uuid: event.clientHttpRequest.token.sub,
          });
          if (profile) {
            profile.picture = this.getProfileUrl(event);
            await profile.save();
            return profile;
          } else {
            profile = new Profile();
            profile.uuid = event.clientHttpRequest.token.sub;
            profile.picture = this.getProfileUrl(event);
            await profile.save();
            return profile;
          }
        },
        error: err => {},
      });
  }

  getProfileUrl(event: NewAvatarUploadedEvent) {
    return (
      'https://' +
      event.cloudBucketCredentials.bucket +
      '.' +
      event.cloudBucketCredentials.endpoint +
      '/' +
      event.cloudBucketCredentials.basePath +
      '/' +
      event.file.originalname
    );
  }
}
