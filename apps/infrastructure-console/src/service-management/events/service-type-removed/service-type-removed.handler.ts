import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ServiceTypeRemovedEvent } from './service-type-removed.event';

@EventsHandler(ServiceTypeRemovedEvent)
export class ServiceTypeRemovedHandler
  implements IEventHandler<ServiceTypeRemovedEvent>
{
  async handle(event: ServiceTypeRemovedEvent) {
    const { serviceType } = event;
    await serviceType.remove();
  }
}
