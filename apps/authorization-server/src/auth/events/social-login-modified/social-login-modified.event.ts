import { IEvent } from '@nestjs/cqrs';
import { SocialLogin } from '../../entities/social-login/social-login.interface';

export class SocialLoginModifiedEvent implements IEvent {
  constructor(public readonly socialLogin: SocialLogin) {}
}
