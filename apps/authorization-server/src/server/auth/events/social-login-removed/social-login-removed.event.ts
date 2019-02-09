import { IEvent } from '@nestjs/cqrs';
import { SocialLogin } from '../../../auth/entities/social-login/social-login.interface';

export class SocialLoginRemovedEvent implements IEvent {
  constructor(
    public readonly userUuid: string,
    public readonly socialLogin: SocialLogin,
  ) {}
}
