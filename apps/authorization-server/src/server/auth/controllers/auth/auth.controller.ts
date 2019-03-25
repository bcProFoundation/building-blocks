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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { callback } from '../../passport/strategies/local.strategy';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { i18n } from '../../../i18n/i18n.config';
import {
  LoginUserDto,
  UserAccountDto,
} from '../../../user-management/policies';
import { PasswordLessDto } from '../../policies/password-less/password-less.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(
    AuthGuard('local', {
      session: true,
      callback,
    }),
  )
  @ApiOperation({
    title: i18n.__('Login'),
    description: 'Login with email or mobile phone',
  })
  login(@Body() body: LoginUserDto, @Req() req, @Res() res) {
    const out: any = { user: req.user.email };
    if (body.redirect) out.path = body.redirect;
    res.json(out);
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    title: i18n.__('Signup'),
    description: i18n.__('Sign up a new user'),
  })
  async signup(@Body() body: UserAccountDto, @Res() res) {
    await this.authService.signUp(body);
    res.json({
      user: body.email,
      message: i18n.__('Signed up successfully'),
    });
  }

  @Get('logout')
  @ApiOperation({
    title: i18n.__('Logout'),
    description: i18n.__('Logout of the session'),
  })
  logout(@Req() req, @Res() res) {
    if (req.session && req.session.secondFactor)
      delete res.session.secondFactor;
    req.logout();
    if (req.query && req.query.redirect) {
      res.redirect(req.query.redirect);
    } else res.redirect('/');
  }

  @Post('verify_user')
  @ApiOperation({
    title: i18n.__('Verify User'),
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
  @UsePipes(ValidationPipe)
  async passwordLess(@Body() payload: PasswordLessDto, @Req() req) {
    const user = await this.authService.passwordLessLogin(payload);
    req.logIn(user, () => {});
    return {
      user: user.email,
      path: payload.redirect,
    };
  }
}
