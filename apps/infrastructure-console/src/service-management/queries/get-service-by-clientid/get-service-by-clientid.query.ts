import { IQuery } from '@nestjs/cqrs';

export class GetServiceByClientIdQuery implements IQuery {
  constructor(public readonly clientId: string) {}
}
