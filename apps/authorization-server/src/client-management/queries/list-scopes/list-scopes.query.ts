import { IQuery } from '@nestjs/cqrs';

export class ListScopesQuery implements IQuery {
  constructor(
    public readonly offset: number,
    public readonly limit: number,
    public readonly search?: string,
    public readonly sort?: string,
  ) {}
}
