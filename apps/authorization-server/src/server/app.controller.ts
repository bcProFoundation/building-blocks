import {
  Get,
  Controller,
  Res,
  UseGuards,
  UseFilters,
  Req,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';
import { ErrorFilter } from './auth/filters/errors.filter';
import { ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  APP_ACCOUNT_TITLE,
  APP_ACCOUNT_DESCRIPTION,
} from './constants/swagger';
import { INDEX_HTML, FOLDER_DIST_BROWSER } from './constants/filesystem';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('info')
  info(@Req() req?) {
    return this.appService.info(req);
  }

  @Get('login')
  @ApiExcludeEndpoint() // Exclude from Swagger documentation
  loginForm(@Req() req, @Res() res) {
    this.appService.login(req, res);
  }

  @Get('signup')
  @ApiExcludeEndpoint()
  signupForm(@Res() res) {
    res.sendFile(INDEX_HTML);
  }

  @Get('account')
  @UseGuards(EnsureLoginGuard)
  @UseFilters(ErrorFilter)
  @ApiOperation({
    title: APP_ACCOUNT_TITLE,
    description: APP_ACCOUNT_DESCRIPTION,
  })
  account(@Res() res) {
    res.sendFile(INDEX_HTML);
  }

  @Get('language/:lang*')
  localeRoot(@Res() res, @Param('lang') lang) {
    res.sendFile(FOLDER_DIST_BROWSER + `-${lang}/index.html`);
  }
}
