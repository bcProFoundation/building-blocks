import { ICommand } from '@nestjs/cqrs';
import { VerifyEmailDto } from '../../policies';

export class VerifyEmailAndSetPasswordCommand implements ICommand {
  constructor(public readonly payload: VerifyEmailDto) {}
}
