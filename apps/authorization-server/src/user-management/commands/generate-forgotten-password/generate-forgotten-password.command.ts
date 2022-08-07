import { ICommand } from '@nestjs/cqrs';

export class GenerateForgottenPasswordCommand implements ICommand {
  constructor(
    public readonly userEmailOrPhone: string,
    public readonly redirect: string,
  ) {}
}
