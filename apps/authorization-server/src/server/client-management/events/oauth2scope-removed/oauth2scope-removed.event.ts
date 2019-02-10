import { IEvent } from '@nestjs/cqrs';
import { Scope } from '../../../client-management/entities/scope/scope.interface';

export class OAuth2ScopeRemovedEvent implements IEvent {
  constructor(
    public readonly scope: Scope,
    public readonly actorUserUuid: string,
  ) {}
}
