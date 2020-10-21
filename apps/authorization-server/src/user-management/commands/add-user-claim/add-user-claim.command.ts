import { ICommand } from '@nestjs/cqrs';
import { UserClaimDto } from '../../controllers/user-claim/user-claim.dto';

export class AddUserClaimCommand implements ICommand {
  constructor(public readonly payload: UserClaimDto) {}
}
