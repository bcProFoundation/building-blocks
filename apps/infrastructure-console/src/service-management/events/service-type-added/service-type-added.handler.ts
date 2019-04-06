import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ServiceTypeAddedEvent } from './service-type-added.event';

@EventsHandler(ServiceTypeAddedEvent)
export class ServiceTypeAddedHandler
  implements IEventHandler<ServiceTypeAddedEvent> {
  async handle(event: ServiceTypeAddedEvent) {
    const { serviceType } = event;
    await serviceType.save();
  }
}
