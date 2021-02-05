import { ICommand } from '@nestjs/cqrs';
import { SignupViaPhoneDto } from '../../policies';

export class SignupViaPhoneCommand implements ICommand {
  constructor(public readonly payload: SignupViaPhoneDto) {}
}
