import { ICommand } from '@nestjs/cqrs';

export class SignUpSocialLoginUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly socialLogin: string,
  ) {}
}
