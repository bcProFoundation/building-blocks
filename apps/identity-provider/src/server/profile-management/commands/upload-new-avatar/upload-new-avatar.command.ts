import { ICommand } from '@nestjs/cqrs';

export class UploadNewAvatarCommand implements ICommand {
  constructor(
    public readonly avatarFile: any,
    public readonly clientHttpRequest: any,
  ) {}
}
