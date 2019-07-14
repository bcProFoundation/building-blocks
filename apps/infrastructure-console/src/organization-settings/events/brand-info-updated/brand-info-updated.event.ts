import { IEvent } from '@nestjs/cqrs';
import { BrandSettings } from '../../entities/brand-settings/brand-settings.entity';

export class BrandInfoUpdatedEvent implements IEvent {
  constructor(public readonly brandSettings: BrandSettings) {}
}
