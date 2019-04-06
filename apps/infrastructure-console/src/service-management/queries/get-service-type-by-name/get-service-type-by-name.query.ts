import { IQuery } from '@nestjs/cqrs';

export class GetServiceTypeByNameQuery implements IQuery {
  constructor(public readonly name: string) {}
}
