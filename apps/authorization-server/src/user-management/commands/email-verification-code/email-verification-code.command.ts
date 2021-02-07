import { ICommand } from '@nestjs/cqrs';

export class EmailVerificationCodeCommand implements ICommand {
  constructor(public readonly userUuid: string) {}
}
