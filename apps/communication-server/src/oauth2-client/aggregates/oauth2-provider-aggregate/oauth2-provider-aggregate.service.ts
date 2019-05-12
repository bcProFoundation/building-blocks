import { Injectable, NotFoundException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { OAuth2ProviderDto } from '../../policies/oauth2-provider-dto/oauth2-provider.dto';
import { OAuth2ProviderAddedEvent } from '../../events/oauth2-provider-added/oauth2-provider-added.event';
import { OAuth2ProviderRemovedEvent } from '../../events/oauth2-provider-removed/oauth2-provider-removed.event';
import { OAuth2ProviderService } from '../../entities/oauth2-provider/oauth2-provider.service';
import { OAuth2Provider } from '../../entities/oauth2-provider/oauth2-provider.entity';

@Injectable()
export class Oauth2ProviderAggregateService extends AggregateRoot {
  constructor(private readonly oauth2Provider: OAuth2ProviderService) {
    super();
  }

  async addProvider(payload: OAuth2ProviderDto) {
    const provider = Object.assign(new OAuth2Provider(), payload);
    this.apply(new OAuth2ProviderAddedEvent(provider));
  }

  async removeProvider(uuid: string) {
    const provider = await this.oauth2Provider.findOne({ uuid });
    if (!provider) throw new NotFoundException({ uuid });
    this.apply(new OAuth2ProviderRemovedEvent(provider));
  }

  async retrieveProvider(uuid: string) {
    const provider = await this.oauth2Provider.findOne({ uuid });
    if (!provider) throw new NotFoundException({ uuid });
    return provider;
  }

  async updateProvider(uuid: string, payload: OAuth2ProviderDto) {
    const provider = await this.oauth2Provider.findOne({ uuid });
    if (!provider) throw new NotFoundException({ uuid });
    const updatedProvider = Object.assign(provider, payload);
    this.apply(new OAuth2ProviderAddedEvent(updatedProvider));
  }

  async list(offset: number, limit: number, search?: string, sort?: string) {
    return this.oauth2Provider.list(offset, limit);
  }
}
