import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';
import { Client } from './client/client.entity';
import { ClientService } from './client/client.service';
import { ConfigModule } from '../config/config.module';
import { EmailAccount } from './email-account/email-account.entity';
import { EmailAccountService } from './email-account/email-account.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Client, User, EmailAccount]),
  ],
  providers: [ClientService, UserService, EmailAccountService],
  exports: [ClientService, UserService, EmailAccountService],
})
export class ModelsModule {}
