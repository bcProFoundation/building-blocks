import { IEvent } from '@nestjs/cqrs';
import { OAuth2Provider } from '../../entities/oauth2-provider/oauth2-provider.entity';

export class OAuth2ProviderAddedEvent implements IEvent {
  constructor(public readonly provider: OAuth2Provider) {}
}
