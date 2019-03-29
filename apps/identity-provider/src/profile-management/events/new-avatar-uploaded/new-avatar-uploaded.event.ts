import { IEvent } from '@nestjs/cqrs';
import { IFile } from './file-interface';
import { BucketSettings } from './bucket-settings-interface';

export class NewAvatarUploadedEvent implements IEvent {
  constructor(
    public readonly file: IFile,
    public readonly clientHttpRequest: { token: { sub: string } },
    public readonly cloudBucketCredentials: BucketSettings,
  ) {}
}
