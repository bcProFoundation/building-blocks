import { Module, Global, HttpModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailEntitiesModule } from './entities/entities.module';
import { EmailController } from './controllers/email/email.controller';
import { EmailService } from './controllers/email/email.service';
import { EmailAggregates } from './aggregates';
import { EmailEventHandlers } from './events';
import { EmailCommandHandlers } from './commands';

@Global()
@Module({
  imports: [CqrsModule, EmailEntitiesModule, HttpModule],
  providers: [
    EmailService,
    ...EmailAggregates,
    ...EmailCommandHandlers,
    ...EmailEventHandlers,
  ],
  controllers: [EmailController],
  exports: [EmailEntitiesModule],
})
export class EmailModule {}
