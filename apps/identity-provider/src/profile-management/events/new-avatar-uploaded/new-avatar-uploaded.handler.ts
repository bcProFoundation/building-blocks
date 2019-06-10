import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { HttpService } from '@nestjs/common';
import * as FormData from 'form-data';
import { NewAvatarUploadedEvent } from './new-avatar-uploaded.event';
import { PUBLIC } from '../../../constants/app-strings';
import { Profile } from '../../../profile-management/entities/profile/profile.entity';
import { ProfileService } from '../../../profile-management/entities/profile/profile.service';

@EventsHandler(NewAvatarUploadedEvent)
export class NewAvatarUploadedHandler
  implements IEventHandler<NewAvatarUploadedEvent> {
  constructor(
    private readonly http: HttpService,
    private readonly profileService: ProfileService,
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

    this.http
      .post(requestUrl, uploadFile, { headers: uploadFile.getHeaders() })
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
