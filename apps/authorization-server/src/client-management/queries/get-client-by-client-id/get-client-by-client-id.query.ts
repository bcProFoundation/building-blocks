import { IQuery } from '@nestjs/cqrs';

export class GetClientByClientIdQuery implements IQuery {
  constructor(
    public readonly clientId: string,
    public readonly userUuid: string,
  ) {}
}
