import { ICommand } from '@nestjs/cqrs';
import { OAuth2ProviderDto } from '../../policies/oauth2-provider-dto/oauth2-provider.dto';

export class AddOAuth2ProviderCommand implements ICommand {
  constructor(public readonly payload: OAuth2ProviderDto) {}
}
