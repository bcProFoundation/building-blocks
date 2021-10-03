import { ForbiddenException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { UserService } from '../../entities/user/user.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { FetchUserForTrustedClientQuery } from './fetch-user-for-trusted-client.query';

@QueryHandler(FetchUserForTrustedClientQuery)
export class FetchUserForTrustedClientHandler implements IQueryHandler {
  constructor(
    private readonly client: ClientService,
    private readonly user: UserService,
  ) {}

  async execute(query: FetchUserForTrustedClientQuery) {
    const client = await this.client.findOne({
      clientId: query?.token?.client,
    });
    if (!client?.isTrusted) {
      throw new ForbiddenException({ isTrusted: client?.isTrusted || 0 });
    }
    const user = await this.user.findUserByEmailOrPhone(query?.emailOrPhone);
    return this.user.getUserWithoutSecrets(user);
  }
}
