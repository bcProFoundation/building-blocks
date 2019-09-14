import { ICommand } from '@nestjs/cqrs';

export class TogglePasswordLessLoginCommand implements ICommand {
  constructor(
    public readonly actorUuid: string,
    public readonly userUuid: string,
    public readonly toggle: TogglePasswordLessLogin,
  ) {}
}

export enum TogglePasswordLessLogin {
  Enable = 'Enable',
  Disable = 'Disable',
}
