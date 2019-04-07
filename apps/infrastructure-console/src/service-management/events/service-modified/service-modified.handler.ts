import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ServiceModifiedEvent } from './service-modified.event';

@EventsHandler(ServiceModifiedEvent)
export class ServiceModifiedHandler
  implements IEventHandler<ServiceModifiedEvent> {
  async handle(event: ServiceModifiedEvent) {
    const { service } = event;
    await service.save();
  }
}
