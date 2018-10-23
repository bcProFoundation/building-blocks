import {
  Controller,
  UseGuards,
  Body,
  Post,
  Req,
  Query,
  Get,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { UserService } from '../../../models/user/user.service';
import { AuthGuard } from '../../guards/auth.guard';
import { callback } from '../../passport/local.strategy';
import { INVALID_PASSWORD } from '../../../constants/messages';

@Controller('user/v1')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptographerService,
  ) {}

  @Post('change_password')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async updatePassword(@Req() req, @Body() body, @Res() res) {
    const authData = await this.userService.getUserSaltedHashPassword(
      req.user.user,
    );
    const validPassword = this.cryptoService.checkPassword(
      authData.password,
      body.currentPassword,
    );
    if (validPassword) {
      authData.password = this.cryptoService.hashPassword(body.newPassword);
      await authData.save();
      res.json({ message: 'updated' });
    } else throw new UnauthorizedException(INVALID_PASSWORD);
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
