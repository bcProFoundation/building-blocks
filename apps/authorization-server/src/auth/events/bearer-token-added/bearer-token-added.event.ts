import { BearerToken } from '../../entities/bearer-token/bearer-token.interface';

export class BearerTokenAddedEvent {
  constructor(public readonly token: BearerToken) {}
}
