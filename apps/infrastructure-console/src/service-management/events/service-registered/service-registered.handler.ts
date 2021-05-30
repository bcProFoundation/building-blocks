import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ServiceRegisteredEvent } from './service-registered.event';

@EventsHandler(ServiceRegisteredEvent)
export class ServiceRegisteredHandler
  implements IEventHandler<ServiceRegisteredEvent>
{
  async handle(event: ServiceRegisteredEvent) {
    const { service } = event;
    await service.save();
  }
}
