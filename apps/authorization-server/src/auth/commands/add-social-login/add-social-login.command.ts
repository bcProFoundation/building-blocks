import { ICommand } from '@nestjs/cqrs';
import { CreateSocialLoginDto } from '../../controllers/social-login/social-login-create.dto';

export class AddSocialLoginCommand implements ICommand {
  constructor(
    public readonly payload: CreateSocialLoginDto,
    public readonly createdBy: string,
  ) {}
}
