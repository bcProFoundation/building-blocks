import { IQuery } from '@nestjs/cqrs';

export class ListServiceTypesQuery implements IQuery {
  constructor(
    public readonly offset: number,
    public readonly limit: number,
    public readonly search?: string,
    public readonly sort?: string,
  ) {}
}
