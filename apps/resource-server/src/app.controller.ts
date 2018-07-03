import {
  Get,
  Controller,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from 'nestjs-auth-guard';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return this.appService.root();
  }

  @UseGuards(AuthGuard('oauth2'))
  @Get('login')
  login() {}

  @Get('logout')
  logout(@Res() res, @Req() req) {
    req.logout();
    res.redirect('/');
  }

  @Get('session/resource')
  @UseGuards(EnsureLoginGuard)
  sessionResource() {
    return { message: 'TaDa!' };
  }

  @Get('bearer/resource')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  bearerResource() {
    return { message: 'TaDa!' };
  }
}

function callback(err, user, info) {
  if (typeof info !== 'undefined') {
    throw new UnauthorizedException(info.message);
  } else if (err || !user) {
    throw err || new UnauthorizedException();
  }
  return user;
}
