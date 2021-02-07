import { ICommand } from '@nestjs/cqrs';

export class AddUnverifiedEmailCommand implements ICommand {
  constructor(
    public readonly userUuid: string,
    public readonly unverifiedEmail: string,
  ) {}
}
