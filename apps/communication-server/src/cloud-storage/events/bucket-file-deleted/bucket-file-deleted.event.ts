import { IEvent } from '@nestjs/cqrs';
import { Storage } from '../../entities/storage/storage.entity';

export class BucketFileDeletedEvent implements IEvent {
  constructor(
    public readonly filename: string,
    public readonly storage: Storage,
    public readonly req: { [key: string]: any },
  ) {}
}
