import { IEvent } from '@nestjs/cqrs';
import { Service } from '../../entities/service/service.entity';

export class ServiceRemovedEvent implements IEvent {
  constructor(public readonly service: Service) {}
}
