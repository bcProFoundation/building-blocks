import {
  Controller,
  UseGuards,
  Session,
  Body,
  Post,
  Req,
  Query,
} from '@nestjs/common';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { UserService } from '../../../models/user/user.service';

@Controller('v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptographerService,
  ) {}

  @Post('update')
  @UseGuards(EnsureLoginGuard)
  async update(@Body() payload, @Session() session) {
    const sessionUser = session.passport.user;
    const user = await this.userService.findOne({ email: sessionUser.email });
    if (payload.password) {
      const authData = await user.password;
      authData.password = await this.cryptoService.hashPassword(
        payload.password,
      );
      authData.save();
    }
    if (payload.name) {
      user.name = payload.name;
    }
    user.save();
    return { updated: user.email };
  }

  // add role to a user (only admins)
  @Post('add/role')
  addRole() {}

  // revoke all tokens of used client(s) for the logged in user
  @Post('revoke/client')
  revokeClient() {}

  @Post('initialize-2fa')
  @UseGuards(EnsureLoginGuard)
  async initialize2fa(@Req() req, @Query('restart') restart) {
    return await this.userService.initializeMfa(
      req.user.email,
      restart || false,
    );
  }

  @Post('verify-2fa')
  @UseGuards(EnsureLoginGuard)
  async verify2fa(@Req() req, @Body('otp') otp) {
    return await this.userService.verify2fa(req.user.email, otp);
  }
}
