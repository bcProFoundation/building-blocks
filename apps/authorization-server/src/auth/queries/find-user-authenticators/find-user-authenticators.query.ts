import { IQuery } from '@nestjs/cqrs';

export class FindUserAuthenticatorsQuery implements IQuery {
  constructor(
    public readonly actorUuid: string,
    public readonly userUuid: string,
  ) {}
}
