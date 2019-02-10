import { Module, Global } from '@nestjs/common';
import { EmailEntitiesModule } from './entities/entities.module';
import { EmailController } from './controllers/email/email.controller';
import { EmailService } from './controllers/email/email.service';
import { SendEmailService } from './aggregates/send-email/send-email.service';
import { SendEmailController } from './aggregates/send-email/send-email.controller';

@Global()
@Module({
  imports: [EmailEntitiesModule],
  providers: [EmailService, SendEmailService],
  controllers: [EmailController, SendEmailController],
  exports: [EmailEntitiesModule],
})
export class EmailModule {}
