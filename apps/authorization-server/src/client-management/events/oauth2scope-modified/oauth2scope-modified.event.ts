import { IEvent } from '@nestjs/cqrs';
import { Scope } from '../../entities/scope/scope.interface';

export class OAuth2ScopeModifiedEvent implements IEvent {
  constructor(
    public readonly scope: Scope,
    public readonly actorUserUuid: string,
  ) {}
}
