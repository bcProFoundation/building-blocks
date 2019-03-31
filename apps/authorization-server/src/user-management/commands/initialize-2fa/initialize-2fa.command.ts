import { ICommand } from '@nestjs/cqrs';

export class Initialize2FACommand implements ICommand {
  constructor(
    public readonly actor: string,
    public readonly restart: boolean,
  ) {}
}
