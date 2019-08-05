import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { i18n } from '../../../i18n/i18n.config';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';
import { BearerTokenRemovedEvent } from '../../events/bearer-token-removed/bearer-token-removed.event';

@Injectable()
export class BearerTokenManagerService extends AggregateRoot {
  constructor(private readonly bearerToken: BearerTokenService) {
    super();
  }

  async removeToken(accessToken: string) {
    const token = await this.bearerToken.findOne({
      accessToken,
    });
    if (token) {
      this.apply(new BearerTokenRemovedEvent(token));
      return { message: i18n.__('Bearer Token Revoked Successfully') };
    } else {
      return { message: i18n.__('Invalid Bearer Token') };
    }
  }
}
