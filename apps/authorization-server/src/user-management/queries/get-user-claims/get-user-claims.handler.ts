import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserClaimsQuery } from './get-user-claims.query';
import { UserClaimService } from '../../../auth/entities/user-claim/user-claim.service';

@QueryHandler(GetUserClaimsQuery)
export class GetUserClaimsHandler implements IQueryHandler {
  constructor(private readonly userClaims: UserClaimService) {}

  async execute(query: GetUserClaimsQuery) {
    const { offset, limit, uuid } = query;
    return await this.userClaims.list(uuid, offset, limit);
  }
}
