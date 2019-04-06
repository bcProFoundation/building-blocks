import { IEvent } from '@nestjs/cqrs';
import { ServiceType } from '../../entities/service-type/service-type.entity';

export class ServiceTypeRemovedEvent implements IEvent {
  constructor(public readonly serviceType: ServiceType) {}
}
