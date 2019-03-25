import { ICommand } from '@nestjs/cqrs';
import { UserAccountDto } from '../../policies';

export class ModifyUserAccountCommand implements ICommand {
  constructor(
    public readonly actorUserUuid: string,
    public readonly userUuidToBeModified: string,
    public readonly userData: UserAccountDto,
  ) {}
}
