import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { AuthServerVerificationGuard } from '../../../auth/guards/authserver-verification.guard';
import { EmailAccountService } from '../../../email/entities/email-account/email-account.service';

@Controller('connect')
export class ConnectController {
  constructor(
    private readonly tokenCacheService: TokenCacheService,
    private readonly emailAccountService: EmailAccountService,
  ) {}

  @Post('v1/token_delete')
  @UseGuards(AuthServerVerificationGuard)
  async tokenDelete(@Body('accessToken') accessToken) {
    await this.tokenCacheService.deleteMany({ accessToken });
  }

  @Post('v1/user_delete')
  @UseGuards(AuthServerVerificationGuard)
  async userDelete(@Body('user') user) {
    const emailAccounts = await this.emailAccountService.find({ owner: user });
    if (emailAccounts.length) {
      for (const account of emailAccounts) {
        await account.remove();
      }
    }
  }
}
