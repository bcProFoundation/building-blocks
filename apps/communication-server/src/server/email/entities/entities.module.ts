import { Global, Module } from '@nestjs/common';
import { EmailAccountService } from './email-account/email-account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailAccount } from './email-account/email-account.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([EmailAccount])],
  providers: [EmailAccountService],
  exports: [EmailAccountService],
})
export class EmailEntitiesModule {}
