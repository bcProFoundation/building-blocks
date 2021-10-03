import { IQuery } from '@nestjs/cqrs';
import { BearerToken } from '../../../auth/entities/bearer-token/bearer-token.interface';

export class FetchUserForTrustedClientQuery implements IQuery {
  constructor(
    public readonly token: BearerToken,
    public readonly emailOrPhone: string,
  ) {}
}
