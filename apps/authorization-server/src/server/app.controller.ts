import {
  Get,
  Controller,
  Res,
  UseGuards,
  UseFilters,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';
import { ErrorFilter } from './common/filters/errors.filter';
import { ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { i18n } from './i18n/i18n.config';
import { INDEX_HTML } from './constants/app-strings';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('info')
  info(@Req() req?) {
    return this.appService.info(req);
  }

  @Get('login')
  @ApiExcludeEndpoint()
  loginForm(@Req() req, @Res() res) {
    this.appService.login(req, res);
  }

  @Get('signup*')
  @ApiExcludeEndpoint()
  signupForm(@Res() res) {
    res.sendFile(INDEX_HTML);
  }

  @Get('account')
  @UseGuards(EnsureLoginGuard)
  @UseFilters(ErrorFilter)
  @ApiOperation({
    title: i18n.__('Account'),
    description: i18n.__('View the logged in User account'),
  })
  account(@Res() res) {
    res.sendFile(INDEX_HTML);
  }
}
