import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { AuthServerVerificationGuard } from '../../../auth/guards/authserver-verification.guard';
import { ProfileService } from '../../../profile-management/entities/profile/profile.service';

@Controller('connect')
export class ConnectController {
  constructor(
    private readonly tokenCacheService: TokenCacheService,
    private readonly profileService: ProfileService,
  ) {}

  @Post('v1/token_delete')
  @UseGuards(AuthServerVerificationGuard)
  async tokenDelete(@Body('accessToken') accessToken) {
    await this.tokenCacheService.deleteMany({ accessToken });
  }

  @Post('v1/user_delete')
  @UseGuards(AuthServerVerificationGuard)
  userDelete(@Body('user') user) {
    return this.profileService.deleteProfile({ uuid: user });
  }
}
