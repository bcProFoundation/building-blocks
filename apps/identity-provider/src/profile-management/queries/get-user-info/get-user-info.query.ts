import { IQuery } from '@nestjs/cqrs';
import { TokenCache } from '../../../auth/entities/token-cache/token-cache.entity';

export class GetUserInfoQuery implements IQuery {
  constructor(public readonly token: TokenCache) {}
}
