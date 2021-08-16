import { ICommand } from '@nestjs/cqrs';
import { User } from '../../entities/user/user.interface';

export class RemoveUnverifiedUserCommand implements ICommand {
  constructor(public readonly user: User) {}
}
