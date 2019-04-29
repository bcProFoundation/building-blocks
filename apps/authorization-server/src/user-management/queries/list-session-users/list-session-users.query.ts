import { IQuery } from '@nestjs/cqrs';
import { Request } from 'express';

export class ListSessionUsersQuery implements IQuery {
  constructor(public readonly request: Request) {}
}
