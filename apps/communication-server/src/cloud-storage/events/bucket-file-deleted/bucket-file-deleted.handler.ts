import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import * as AWS from 'aws-sdk';
import { BucketFileDeletedEvent } from './bucket-file-deleted.event';

@EventsHandler(BucketFileDeletedEvent)
export class BucketFileDeletedHandler
  implements IEventHandler<BucketFileDeletedEvent> {
  handle(event: BucketFileDeletedEvent) {
    const spacesEndpoint: any = new AWS.Endpoint(event.storage.endpoint);
    const s3 = new AWS.S3({
      region: event.storage.region,
      endpoint: spacesEndpoint,
      accessKeyId: event.storage.accessKey,
      secretAccessKey: event.storage.secretKey,
    });

    // remove a file from bucket
    const params = {
      Bucket: event.storage.bucket,
      Key: event.storage.basePath + '/' + event.filename,
    };
    s3.deleteObject(params, (err, data) => {});
  }
}
