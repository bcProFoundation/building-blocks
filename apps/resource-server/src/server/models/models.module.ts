import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';
import { Session } from './session/session.entity';
import { SessionService } from './session/session.service';
import { Client } from './client/client.entity';
import { ClientService } from './client/client.service';
import { ClientFixture } from './client/client.fixture';
import { ConfigModule } from 'config/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session, User, Client]), ConfigModule],
  providers: [SessionService, UserService, ClientService, ClientFixture],
  exports: [SessionService, UserService, ClientService],
})
export class ModelsModule {}
