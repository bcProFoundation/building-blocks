import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { UploadAvatarMetaDataService } from '../../../profile-management/policies/upload-avatar-meta-data/upload-avatar-meta-data.service';
import { NewAvatarUploadedEvent } from '../../../profile-management/events/new-avatar-uploaded/new-avatar-uploaded.event';
import { map } from 'rxjs/operators';

@Injectable()
export class ProfileManagerAggregateService extends AggregateRoot {
  constructor(private readonly avatarMetaData: UploadAvatarMetaDataService) {
    super();
  }

  uploadNewAvatar(avatarFile, clientHttpRequest) {
    return this.avatarMetaData
      .uploadNewAvatarMetaData(avatarFile, clientHttpRequest)
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
}
