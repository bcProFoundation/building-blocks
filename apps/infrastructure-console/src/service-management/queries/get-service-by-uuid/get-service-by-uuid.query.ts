import { IQuery } from '@nestjs/cqrs';

export class GetServiceByUuidQuery implements IQuery {
  constructor(public readonly uuid: string) {}
}
