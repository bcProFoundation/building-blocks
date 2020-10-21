import { IQuery } from '@nestjs/cqrs';

export class GetUserClaimsQuery implements IQuery {
  constructor(
    public readonly uuid: string,
    public readonly offset: number,
    public readonly limit: number,
  ) {}
}
