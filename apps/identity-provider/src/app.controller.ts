import {
  Get,
  Controller,
  Render,
  Req,
  Res,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';
import { ErrorFilter } from './auth/filters/errors.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return this.appService.root();
  }

  @Get('login')
  @Render('login')
  loginForm(@Req() req) {}

  @Get('signup')
  @Render('signup')
  signupForm() {}

  @Get('account')
  @UseGuards(EnsureLoginGuard)
  @UseFilters(ErrorFilter)
  @Render('account')
  account(@Req() req) {
    return { user: req.user ? req.user.email : 'Guest' };
  }

  @Get('logout')
  logout(@Req() req, @Res() res) {
    req.logout();
    res.json({message: 'logout'});
  }
}
