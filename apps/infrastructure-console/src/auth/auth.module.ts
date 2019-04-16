import { Module, Global, HttpModule } from '@nestjs/common';
import { AuthEntitiesModule } from './entities/entities.module';
import { AuthServerVerificationGuard } from './guards/authserver-verification.guard';
import { RoleGuard } from './guards/role.guard';
import { TokenGuard } from './guards/token.guard';
import { AuthSchedulers } from './schedulers';

@Global()
@Module({
  imports: [AuthEntitiesModule, HttpModule],
  providers: [
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
