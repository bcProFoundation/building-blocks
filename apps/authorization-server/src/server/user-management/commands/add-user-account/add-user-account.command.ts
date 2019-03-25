import { ICommand } from '@nestjs/cqrs';
import { UserAccountDto } from '../../policies';

export class AddUserAccountCommand implements ICommand {
  constructor(
    public readonly actorUuid: string,
    public readonly userData: UserAccountDto,
  ) {}
}
