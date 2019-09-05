import { IQuery } from '@nestjs/cqrs';

export class GetClientByUuidQuery implements IQuery {
  constructor(
    public readonly clientUuid: string,
    public readonly userUuid: string,
  ) {}
}
