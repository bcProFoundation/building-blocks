import { ICommand } from '@nestjs/cqrs';
import { CreateSocialLoginDto } from '../../controllers/social-login/social-login-create.dto';

export class ModifySocialLoginCommand implements ICommand {
  constructor(
    public readonly payload: CreateSocialLoginDto,
    public readonly uuid: string,
  ) {}
}
