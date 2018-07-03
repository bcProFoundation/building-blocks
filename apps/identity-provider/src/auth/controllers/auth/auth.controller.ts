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
import { callback } from 'auth/passport/local.strategy';
import { CreateUserDto } from 'models/user/create-user.dto';
import { AuthGuard } from 'nestjs-auth-guard';

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
  login(@Body() body, @Req() req, @Res() res) {
    const out: any = { user: req.user.email };
    if (body.redirect) out.path = body.redirect;
    res.json(out);
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body() body: CreateUserDto, @Res() res) {
    /** TODO:
     *  - Fire email to signup
     *  - Sign via phone
     *  - 2FA
     */
    await this.authService.signUp(body);
    res.json({
      user: body.email,
      message: 'success',
    });
  }
}
