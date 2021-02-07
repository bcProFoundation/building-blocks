import { ICommand } from '@nestjs/cqrs';
import { SignupViaEmailDto } from '../../policies';

export class SignupViaEmailCommand implements ICommand {
  constructor(public readonly payload: SignupViaEmailDto) {}
}
