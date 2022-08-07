import {
  Controller,
  Post,
  Res,
  Req,
  UseGuards,
  Body,
  ValidationPipe,
  UsePipes,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { i18n } from '../../../i18n/i18n.config';
import { LoginUserDto } from '../../policies/login-user/login-user.dto';
import { PasswordLessDto } from '../../policies/password-less/password-less.dto';
import { LocalUserGuard } from '../../guards/local-user.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalUserGuard)
  @ApiOperation({
    summary: i18n.__('Login'),
    description: 'Login with email or mobile phone',
  })
  login(@Body() body: LoginUserDto, @Req() req, @Res() res) {
    const out: any = { user: req.user.email };
    if (body.redirect) out.path = body.redirect;
    res.json(out);
  }

  @Get('logout')
  @ApiOperation({
    summary: i18n.__('Logout'),
    description: i18n.__('Logout of the session'),
  })
  logout(@Param('uuid') uuid, @Req() req, @Res() res) {
    return this.authService.logout(req, res);
  }

  @Get('logout/:uuid')
  @ApiOperation({
    summary: i18n.__('Logout'),
    description: i18n.__('Logout of the session'),
  })
  logoutUuid(@Param('uuid') uuid, @Req() req, @Res() res) {
    this.authService.logoutUuid(uuid, req, res);
  }

  @Post('verify_user')
  @ApiOperation({
    summary: i18n.__('Verify User'),
    description: i18n.__('Check whether the user exists and retrieve a record'),
  })
  async verifyUser(
    @Body('username') username: string,
    @Body('password') password?: string,
  ) {
    return await this.authService.verifyUser(username, password);
  }

  @Post('verify_password')
  async verifyPassword(@Body('username') username, @Body('password') password) {
    return {
      verified: await this.authService.verifyPassword(username, password),
    };
  }

  @Post('password_less')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async passwordLess(@Body() payload: PasswordLessDto, @Req() req) {
    return await this.authService.passwordLess(payload, req);
  }

  @Post('choose_user')
  @HttpCode(HttpStatus.OK)
  async chooseUser(
    @Body('uuid') uuid: string,
    @Req() req,
    @Body('redirect') redirect = '/account',
  ) {
    const user = await this.authService.chooseUser(req, uuid);
    return {
      uuid: user.uuid,
      email: user.email,
      phone: user.phone,
      path: redirect,
    };
  }
}
