import { BadRequestException, Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { INVALID_USER } from '../../../constants/messages';
import { NewAvatarUploadedEvent } from '../../../profile-management/events/new-avatar-uploaded/new-avatar-uploaded.event';
import { UploadAvatarMetaDataService } from '../../../profile-management/policies/upload-avatar-meta-data/upload-avatar-meta-data.service';
import { ProfileService } from '../../entities/profile/profile.service';
import { AvatarDeletedEvent } from '../../events/avatar-deleted/avatar-deleted.event';
import { ProfileDeletedEvent } from '../../events/profile-deleted/profile-deleted.event';

@Injectable()
export class ProfileManagerAggregateService extends AggregateRoot {
  constructor(
    private readonly avatarMetaData: UploadAvatarMetaDataService,
    private readonly profile: ProfileService,
    private readonly clientToken: ClientTokenManagerService,
  ) {
    super();
  }

  uploadNewAvatar(avatarFile, clientHttpRequest) {
    return this.avatarMetaData
      .uploadNewAvatarMetaData(clientHttpRequest.token.accessToken)
      .pipe(
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
    return lastValueFrom(
      this.avatarMetaData.uploadNewAvatarMetaData(req.token.accessToken).pipe(
        map(bucketSettings => {
          if (bucketSettings) {
            this.apply(new AvatarDeletedEvent(profile, bucketSettings));
          }
        }),
      ),
    );
  }

  async deleteProfile(uuid: string) {
    const profile = await this.profile.findOne({ uuid });
    if (profile) {
      await lastValueFrom(
        this.clientToken.getClientToken().pipe(
          switchMap(token => {
            return this.avatarMetaData.uploadNewAvatarMetaData(
              token.accessToken,
            );
          }),
          map(bucketSettings => {
            if (bucketSettings) {
              this.apply(new AvatarDeletedEvent(profile, bucketSettings));
            }
            this.apply(new ProfileDeletedEvent(profile));
          }),
        ),
      );
    }
  }
}
