import { ICommand } from '@nestjs/cqrs';
import { User } from '../../../user-management/entities/user/user.interface';

export class SendLoginOTPCommand implements ICommand {
  constructor(public readonly user: User) {}
}
