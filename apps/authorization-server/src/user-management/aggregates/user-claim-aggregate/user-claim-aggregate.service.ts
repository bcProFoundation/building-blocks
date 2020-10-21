import { BadRequestException, Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { UserClaimDto } from '../../controllers/user-claim/user-claim.dto';
import { UserService } from '../../entities/user/user.service';
import { UserClaimService } from '../../../auth/entities/user-claim/user-claim.service';
import { UserClaimUpdatedEvent } from '../../events/user-claim-updated/user-claim-updated.event';
import { UserClaimAddedEvent } from '../../events/user-claim-added/user-claim-added.event';
import { UserClaim } from '../../../auth/entities/user-claim/user-claim.interface';
import { UserClaimRemovedEvent } from '../../events/user-claim-removed/user-claim-removed.event';

@Injectable()
export class UserClaimAggregateService extends AggregateRoot {
  constructor(
    private readonly userClaim: UserClaimService,
    private readonly user: UserService,
  ) {
    super();
  }

  async addUserClaim(payload: UserClaimDto) {
    await this.validateUser(payload.uuid);
    await this.checkIfClaimExists(payload.uuid, payload.name);

    this.apply(new UserClaimAddedEvent(payload as UserClaim));

    return payload;
  }

  async updateUserClaim(payload: UserClaimDto) {
    await this.validateUser(payload.uuid);

    const claim = await this.checkIfClaimDoesNotExists(
      payload.uuid,
      payload.name,
    );

    // update claim
    claim.scope = payload.scope;
    claim.value = payload.value;

    this.apply(new UserClaimUpdatedEvent(claim));

    return claim;
  }

  async removeUserClaim(uuid: string, name: string) {
    await this.validateUser(uuid);
    const claim = await this.checkIfClaimDoesNotExists(uuid, name);

    this.apply(new UserClaimRemovedEvent(claim));
    return claim;
  }

  async validateUser(uuid) {
    const user = await this.user.findOne({ uuid });
    if (!user) {
      throw new BadRequestException({ uuid });
    }
    return user;
  }

  async checkIfClaimExists(uuid: string, name: string) {
    const claim = await this.userClaim.findOne({ uuid, name });
    if (claim) {
      throw new BadRequestException({ claim });
    }
  }

  async checkIfClaimDoesNotExists(uuid: string, name: string) {
    const claim = await this.userClaim.findOne({ uuid, name });
    if (!claim) {
      throw new BadRequestException({ claim });
    }
    return claim;
  }
}
