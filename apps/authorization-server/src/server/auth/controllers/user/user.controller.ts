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

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptographerService,
  ) {}

  @Post('v1/change_password')
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

  @Post('v1/update_full_name')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async updateFullName(@Req() req, @Body('name') name, @Res() res) {
    const user = await this.userService.findOne({ uuid: req.user.user });
    user.name = name;
    await user.save();
    res.json(user);
  }

  @Post('v1/initialize-2fa')
  @UseGuards(EnsureLoginGuard)
  async initialize2fa(@Req() req, @Query('restart') restart) {
    return await this.userService.initializeMfa(
      req.user.email,
      restart || false,
    );
  }

  @Post('v1/verify-2fa')
  @UseGuards(EnsureLoginGuard)
  async verify2fa(@Req() req, @Body('otp') otp) {
    return await this.userService.verify2fa(req.user.email, otp);
  }

  @Get('v1/get_user')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async getUser(@Req() req, @Res() res) {
    const user = await this.userService.findOne({ uuid: req.user.user });
    res.json(user);
  }

  @Get('list')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async list(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    return await this.userService.paginate(search, {
      offset: Number(offset),
      limit: Number(limit),
    });
  }
}
