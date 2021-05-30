import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BrandInfoUpdatedEvent } from './brand-info-updated.event';

@EventsHandler(BrandInfoUpdatedEvent)
export class BrandInfoUpdatedHandler
  implements IEventHandler<BrandInfoUpdatedEvent>
{
  handle(event: BrandInfoUpdatedEvent) {
    const { brandSettings } = event;

    brandSettings
      .save()
      .then(success => {})
      .catch(error => {});
  }
}
