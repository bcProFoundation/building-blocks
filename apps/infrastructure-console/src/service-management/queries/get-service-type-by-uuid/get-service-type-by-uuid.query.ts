import { IQuery } from '@nestjs/cqrs';

export class GetServiceTypeByUuidQuery implements IQuery {
  constructor(public readonly uuid: string) {}
}
