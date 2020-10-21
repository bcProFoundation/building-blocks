import { ICommand } from '@nestjs/cqrs';
import { UserClaimDto } from '../../controllers/user-claim/user-claim.dto';

export class UpdateUserClaimCommand implements ICommand {
  constructor(public readonly payload: UserClaimDto) {}
}
