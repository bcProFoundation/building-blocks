import { IEvent } from '@nestjs/cqrs';
import { AuthData } from '../../../user-management/entities/auth-data/auth-data.interface';

export class WebAuthnKeyChallengeRequestedEvent implements IEvent {
  constructor(
    public readonly authData: AuthData,
    public readonly challengeType: WebauthnChallengeType,
  ) {}
}

export enum WebauthnChallengeType {
  Login = 'Login',
  Registration = 'Registration',
}
