import { IQuery } from '@nestjs/cqrs';

export class RetrieveRolesQuery implements IQuery {
  constructor(public readonly uuid: string) {}
}
