import { IEvent } from '@nestjs/cqrs';

export class SocialLoginUserSignedUpEvent implements IEvent {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly socialLogin: string,
  ) {}
}
