import { Module, HttpModule } from '@nestjs/common';
import { IDPStrategy } from './passport/idp.strategy';
import { AuthController } from './controllers/auth.controller';
import { CookieSerializer } from './passport/passport-cookie.serializer';
import { ModelsModule } from 'models/models.module';
import { HttpBearerStrategy } from './passport/http-bearer.strategy';
import { ConfigModule } from 'config/config.module';
import { AccountManager } from 'craft-account-manager';

@Module({
  imports: [ModelsModule, HttpModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    CookieSerializer,
    IDPStrategy,
    HttpBearerStrategy,
    AccountManager,
  ],
})
export class AuthModule {}
