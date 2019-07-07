import { Injectable, BadRequestException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { UploadAvatarMetaDataService } from '../../../profile-management/policies/upload-avatar-meta-data/upload-avatar-meta-data.service';
import { NewAvatarUploadedEvent } from '../../../profile-management/events/new-avatar-uploaded/new-avatar-uploaded.event';
import { map } from 'rxjs/operators';
import { ProfileService } from '../../entities/profile/profile.service';
import { INVALID_USER } from '../../../constants/messages';
import { AvatarDeletedEvent } from '../../events/avatar-deleted/avatar-deleted.event';

@Injectable()
export class ProfileManagerAggregateService extends AggregateRoot {
  constructor(
    private readonly avatarMetaData: UploadAvatarMetaDataService,
    private readonly profile: ProfileService,
  ) {
    super();
  }

  uploadNewAvatar(avatarFile, clientHttpRequest) {
    return this.avatarMetaData.uploadNewAvatarMetaData(clientHttpRequest).pipe(
      map(cloudBucketCredentials => {
        if (cloudBucketCredentials) {
          this.apply(
            new NewAvatarUploadedEvent(
              avatarFile,
              clientHttpRequest,
              cloudBucketCredentials,
            ),
          );
        }
      }),
    );
  }

  async deleteAvatar(uuid: string, req) {
    const profile = await this.profile.findOne({ uuid });
    if (!profile) throw new BadRequestException(INVALID_USER);
    return this.avatarMetaData
      .uploadNewAvatarMetaData(req)
      .pipe(
        map(bucketSettings => {
          if (bucketSettings) {
            this.apply(new AvatarDeletedEvent(profile, bucketSettings));
          }
        }),
      )
      .toPromise();
  }
}
