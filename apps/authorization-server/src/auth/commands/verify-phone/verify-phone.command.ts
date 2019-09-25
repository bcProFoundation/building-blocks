import { ICommand } from '@nestjs/cqrs';

export class VerifyPhoneCommand implements ICommand {
  constructor(public readonly userUuid: string, public readonly otp: string) {}
}
