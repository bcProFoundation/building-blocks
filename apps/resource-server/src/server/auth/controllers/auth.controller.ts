import { Get, Controller, UseGuards, Res, Req } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ROOT_ROUTE } from 'constants/locations';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('oauth2', { failureRedirect: '/login' }))
  @Get('callback')
  callback(@Res() res) {
    // redirect to root after login;
    res.redirect(ROOT_ROUTE);
  }
}
