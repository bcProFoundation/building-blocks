import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus, CQRSModule } from '@nestjs/cqrs';
import { EmailEntitiesModule } from './entities/entities.module';
import { EmailController } from './controllers/email/email.controller';
import { EmailService } from './controllers/email/email.service';
import { EmailAggregates } from './aggregates';
import { EmailEventHandlers } from './events';
import { EmailCommandHandlers } from './commands';

@Global()
@Module({
  imports: [CQRSModule, EmailEntitiesModule],
  providers: [
    EmailService,
    ...EmailAggregates,
    ...EmailCommandHandlers,
    ...EmailEventHandlers,
  ],
  controllers: [EmailController],
  exports: [EmailEntitiesModule],
})
export class EmailModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  onModuleInit() {
    this.commandBus.setModuleRef(this.moduleRef);
    this.eventBus.setModuleRef(this.moduleRef);
    this.commandBus.register(EmailCommandHandlers);
    this.eventBus.register(EmailEventHandlers);
  }
}
