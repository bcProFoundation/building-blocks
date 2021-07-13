import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthEntitiesModule } from './entities/entities.module';
import { AuthServerVerificationGuard } from './guards/authserver-verification.guard';
import { RoleGuard } from './guards/role.guard';
import { TokenGuard } from './guards/token.guard';
import { AuthSchedulers } from './schedulers';

@Global()
@Module({
  imports: [AuthEntitiesModule, HttpModule],
  providers: [
    // Guards
    AuthServerVerificationGuard,
    RoleGuard,
    TokenGuard,
    ...AuthSchedulers,
  ],
  exports: [
    AuthEntitiesModule,
    AuthServerVerificationGuard,
    RoleGuard,
    TokenGuard,
  ],
})
export class AuthModule {}
