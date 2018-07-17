import { Get, Controller, UseGuards, Res, Req } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('oauth2', { failureRedirect: '/login' }))
  @Get('callback')
  callback(@Res() res) {
    // redirect to root after login;
    res.redirect('/');
  }
}
