import { ICommand } from '@nestjs/cqrs';
import { CreateScopeDto } from '../../../user-management/policies';

export class AddOAuth2ScopeCommand implements ICommand {
  constructor(
    public readonly actorUserUuid: string,
    public readonly scope: CreateScopeDto,
  ) {}
}
