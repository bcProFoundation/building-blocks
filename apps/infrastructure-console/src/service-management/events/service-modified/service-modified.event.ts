import { IEvent } from '@nestjs/cqrs';
import { Service } from '../../entities/service/service.entity';

export class ServiceModifiedEvent implements IEvent {
  constructor(public readonly service: Service) {}
}
