import {
  Get,
  Controller,
  Render,
  Req,
  Res,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AppService } from 'app.service';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';
import { ErrorFilter } from 'auth/filters/errors.filter';
import { ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  APP_ACCOUNT_TITLE,
  APP_ACCOUNT_DESCRIPTION,
  APP_LOGOUT_TITLE,
} from 'constants/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return this.appService.root();
  }

  @Get('login')
  @Render('login')
  @ApiExcludeEndpoint() // Exclude from Swagger documentation
  loginForm(@Req() req) {}

  @Get('signup')
  @Render('signup')
  @ApiExcludeEndpoint()
  signupForm() {}

  @Get('account')
  @UseGuards(EnsureLoginGuard)
  @UseFilters(ErrorFilter)
  @Render('account')
  @ApiOperation({
    title: APP_ACCOUNT_TITLE,
    description: APP_ACCOUNT_DESCRIPTION,
  })
  account(@Req() req) {
    return { user: req.user ? req.user.email : 'Guest' };
  }

  @Get('logout')
  @ApiOperation({
    title: APP_LOGOUT_TITLE,
    description: APP_ACCOUNT_DESCRIPTION,
  })
  logout(@Req() req, @Res() res) {
    req.logout();
    res.json({ message: 'logout' });
  }
}
