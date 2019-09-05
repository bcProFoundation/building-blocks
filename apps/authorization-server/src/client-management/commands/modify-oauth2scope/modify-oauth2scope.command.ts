import { ICommand } from '@nestjs/cqrs';
import { CreateScopeDto } from '../../../user-management/policies';

export class ModifyOAuth2ScopeCommand implements ICommand {
  constructor(
    public readonly actorUserUuid: string,
    public readonly scopeUuid: string,
    public readonly payload: CreateScopeDto,
  ) {}
}
