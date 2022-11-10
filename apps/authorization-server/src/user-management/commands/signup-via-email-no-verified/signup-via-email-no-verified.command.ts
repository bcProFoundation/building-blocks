import { ICommand } from '@nestjs/cqrs';
import { SignupViaEmailNoVerifiedDto } from '../../policies';

export class SignupViaEmailNoVerifiedCommand implements ICommand {
  constructor(public readonly payload: SignupViaEmailNoVerifiedDto) {}
}
