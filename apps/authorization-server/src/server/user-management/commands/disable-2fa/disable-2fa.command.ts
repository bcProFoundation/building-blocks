import { ICommand } from '@nestjs/cqrs';

export class Disable2FACommand implements ICommand {
  constructor(public readonly userUuid: string) {}
}
