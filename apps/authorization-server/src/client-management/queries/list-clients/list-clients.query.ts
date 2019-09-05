import { IQuery } from '@nestjs/cqrs';

export class ListClientsQuery implements IQuery {
  constructor(
    public readonly userUuid: string,
    public readonly offset: number,
    public readonly limit: number,
    public readonly search?: string,
    public readonly sort?: string,
  ) {}
}
