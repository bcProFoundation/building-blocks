import { ICommand } from '@nestjs/cqrs';

export class TogglePasswordLessLoginCommand implements ICommand {
  constructor(
    public readonly userUuid: string,
    public readonly toggle: TogglePasswordLessLogin,
  ) {}
}

export enum TogglePasswordLessLogin {
  Enable,
  Disable,
}
