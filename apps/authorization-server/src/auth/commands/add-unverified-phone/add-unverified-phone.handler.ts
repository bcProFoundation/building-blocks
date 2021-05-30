import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AddUnverifiedMobileCommand } from './add-unverified-phone.command';
import { OTPAggregateService } from '../../aggregates/otp-aggregate/otp-aggregate.service';

@CommandHandler(AddUnverifiedMobileCommand)
export class AddUnverifiedMobileHandler
  implements ICommandHandler<AddUnverifiedMobileCommand>
{
  constructor(
    private readonly manager: OTPAggregateService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: AddUnverifiedMobileCommand) {
    const { userUuid, unverifiedPhone } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.addUnverifiedPhone(userUuid, unverifiedPhone);
    aggregate.commit();
  }
}
