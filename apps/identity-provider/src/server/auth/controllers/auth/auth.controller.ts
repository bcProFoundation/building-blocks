import {
  Controller,
  Post,
  Res,
  Req,
  UseGuards,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { callback } from '../../passport/local.strategy';
import { CreateUserDto } from '../../../models/user/create-user.dto';
import {
  AuthGuard as AuthenticationGuard,
  TestAuthGuard,
} from '../../guards/auth.guard';

// Constants
import { SUCCESS_MESSAGE } from '../../../constants/messages';
import {
  AUTH_LOGIN_TITLE,
  AUTH_LOGIN_DESCRIPTION,
  AUTH_SIGNUP_DESCRIPTION,
  AUTH_SIGNUP_TITLE,
} from '../../../constants/swagger';

// Swagger
import { ApiOperation } from '@nestjs/swagger';
import { LoginUserDto } from '../../../models/user/login-user.dto';

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
    title: AUTH_LOGIN_TITLE,
    description: AUTH_LOGIN_DESCRIPTION,
  })
  login(@Body() body: LoginUserDto, @Req() req, @Res() res) {
    const out: any = { user: req.user.email };
    if (body.redirect) out.path = body.redirect;
    res.json(out);
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    title: AUTH_SIGNUP_TITLE,
    description: AUTH_SIGNUP_DESCRIPTION,
  })
  async signup(@Body() body: CreateUserDto, @Res() res) {
    /** TODO:
     *  - Fire email to signup
     *  - Sign via phone
     *  - 2FA
     */
    await this.authService.signUp(body);
    res.json({
      user: body.email,
      message: SUCCESS_MESSAGE,
    });
  }
}
