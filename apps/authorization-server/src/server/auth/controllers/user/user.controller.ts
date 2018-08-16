import { Controller, UseGuards, Session, Body, Post } from '@nestjs/common';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { UserService } from '../../../models/user/user.service';

@Controller('user')
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
}
