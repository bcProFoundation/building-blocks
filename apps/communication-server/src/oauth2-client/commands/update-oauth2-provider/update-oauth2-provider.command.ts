import { ICommand } from '@nestjs/cqrs';
import { OAuth2ProviderDto } from '../../policies/oauth2-provider-dto/oauth2-provider.dto';

export class UpdateOAuth2ProviderCommand implements ICommand {
  constructor(
    public readonly providerUuid: string,
    public readonly payload: OAuth2ProviderDto,
  ) {}
}
