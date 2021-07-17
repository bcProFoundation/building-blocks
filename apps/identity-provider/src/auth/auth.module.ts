import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthEntitiesModule } from './entities/auth-entities.module';
import { AuthServerVerificationGuard } from './guards/authserver-verification.guard';
import { RoleGuard } from './guards/role.guard';
import { TokenGuard } from './guards/token.guard';
import { AuthSchedulers } from './schedulers';
import { AuthAggregates } from './aggregates';
import { AuthControllers } from './controllers';

@Global()
@Module({
  imports: [AuthEntitiesModule, HttpModule],
  providers: [
    AuthServerVerificationGuard,
    RoleGuard,
    TokenGuard,
    ...AuthSchedulers,
    ...AuthAggregates,
  ],
  exports: [
    AuthEntitiesModule,
    AuthServerVerificationGuard,
    RoleGuard,
    TokenGuard,
    ...AuthAggregates,
  ],
  controllers: [...AuthControllers],
})
export class AuthModule {}
