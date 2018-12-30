import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TokenCacheService } from '../../models/token-cache/token-cache.service';
import { AuthServerVerificationGuard } from '../../guards/authserver-verification.guard';

@Controller('connect')
export class ConnectController {
  constructor(private readonly tokenCacheService: TokenCacheService) {}

  @Post('v1/token_delete')
  @UseGuards(AuthServerVerificationGuard)
  async tokenDelete(@Body('accessToken') accessToken) {
    await this.tokenCacheService.deleteMany({ accessToken });
  }

  @Post('v1/user_delete')
  @UseGuards(AuthServerVerificationGuard)
  userDelete(@Body('user') user) {
    // No Personal data stored on infrastructure-console
    return { user };
  }
}
