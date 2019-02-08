import { Module, Global } from '@nestjs/common';
import { EmailEntitiesModule } from './entities/entities.module';
import { EmailController } from './controllers/email/email.controller';
import { EmailService } from './controllers/email/email.service';

@Global()
@Module({
  imports: [EmailEntitiesModule],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailEntitiesModule],
})
export class EmailModule {}
