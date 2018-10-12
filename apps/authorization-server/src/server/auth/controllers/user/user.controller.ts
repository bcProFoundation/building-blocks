import {
  Controller,
  UseGuards,
  Session,
  Body,
  Post,
  Req,
  Query,
  Get,
  Res,
} from '@nestjs/common';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { UserService } from '../../../models/user/user.service';
import { AuthGuard } from '../../guards/auth.guard';
import { callback } from '../../passport/local.strategy';

@Controller('user/v1')
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

  @Post('update_full_name')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async updateFullName(@Req() req, @Body('name') name, @Res() res) {
    const user = await this.userService.findOne({ uuid: req.user.user });
    user.name = name;
    await user.save();
    res.json(user);
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

  @Get('get_user')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async getUser(@Req() req, @Res() res) {
    const user = await this.userService.findOne({ uuid: req.user.user });
    res.json(user);
  }
}
