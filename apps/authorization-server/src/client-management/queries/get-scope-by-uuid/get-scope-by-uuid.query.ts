import { IQuery } from '@nestjs/cqrs';

export class GetScopeByUuidQuery implements IQuery {
  constructor(public readonly uuid: string) {}
}
