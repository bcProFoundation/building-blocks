import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthServerVerificationGuard } from '../../../auth/guards/authserver-verification.guard';
import { ConnectService } from './connect.service';

@Controller('connect')
export class ConnectController {
  constructor(private readonly connect: ConnectService) {}

  @Post('v1/token_delete')
  @UseGuards(AuthServerVerificationGuard)
  async tokenDelete(@Body('accessToken') accessToken) {
    return await this.connect.tokenDelete(accessToken);
  }

  @Post('v1/user_delete')
  @UseGuards(AuthServerVerificationGuard)
  async userDelete(@Body('user') user) {
    return await this.connect.deleteProfile(user);
  }
}
