import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { UpdateBrandInfoCommand } from './update-brand-info.command';
import { BrandAggregateService } from '../../aggregates/brand-aggregate/brand-aggregate.service';

@CommandHandler(UpdateBrandInfoCommand)
export class UpdateBrandInfoHandler
  implements ICommandHandler<UpdateBrandInfoCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: BrandAggregateService,
  ) {}

  async execute(command: UpdateBrandInfoCommand) {
    const { req, payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.updateBrandInfo(req, payload);
    aggregate.commit();
  }
}
