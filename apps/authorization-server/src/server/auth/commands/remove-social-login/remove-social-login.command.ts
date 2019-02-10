import { ICommand } from '@nestjs/cqrs';

export class RemoveSocialLoginCommand implements ICommand {
  constructor(
    public readonly userUuid: string,
    public readonly socialLoginUuid: string,
  ) {}
}
