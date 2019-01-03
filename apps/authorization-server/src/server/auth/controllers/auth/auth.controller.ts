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
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { callback } from '../../passport/local.strategy';
import { CreateUserDto } from '../../../models/user/create-user.dto';
import {
  AuthGuard as AuthenticationGuard,
  TestAuthGuard,
} from '../../guards/auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { LoginUserDto } from '../../../models/user/login-user.dto';
import { i18n } from '../../../i18n/i18n.config';

let AuthGuard;
if (process.env.NODE_ENV === 'test') AuthGuard = TestAuthGuard;
else AuthGuard = AuthenticationGuard;

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
  async signup(@Body() body: CreateUserDto, @Res() res) {
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
    @Res() res,
    @Body('username') username: string,
    @Body('password') password?: string,
  ) {
    username = username.trim().toLocaleLowerCase();
    let user = await this.authService.findUserByEmailOrPhone(username);

    if (password) {
      user = await this.authService.logIn(username, password);
      if (!user) throw new UnauthorizedException(i18n.__('Invalid password'));
    }

    delete user._id, user.password;
    res.json({ user });
  }

  @Post('verify_password')
  async verifyPassword(@Body('username') username, @Body('password') password) {
    return {
      verified: await this.authService.verifyPassword(username, password),
    };
  }
}
