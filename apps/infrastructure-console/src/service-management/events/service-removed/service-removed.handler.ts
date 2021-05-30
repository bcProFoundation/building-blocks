import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ServiceRemovedEvent } from './service-removed.event';

@EventsHandler(ServiceRemovedEvent)
export class ServiceRemovedHandler
  implements IEventHandler<ServiceRemovedEvent>
{
  async handle(event: ServiceRemovedEvent) {
    const { service } = event;
    await service.remove();
  }
}
