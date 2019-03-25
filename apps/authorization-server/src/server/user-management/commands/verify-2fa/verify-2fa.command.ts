import { ICommand } from '@nestjs/cqrs';

export class Verify2FACommand implements ICommand {
  constructor(public readonly userUuid: string, public readonly otp: string) {}
}
