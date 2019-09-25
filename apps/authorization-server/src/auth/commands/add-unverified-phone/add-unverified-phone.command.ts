import { ICommand } from '@nestjs/cqrs';

export class AddUnverifiedMobileCommand implements ICommand {
  constructor(
    public readonly userUuid: string,
    public readonly unverifiedPhone: string,
  ) {}
}
