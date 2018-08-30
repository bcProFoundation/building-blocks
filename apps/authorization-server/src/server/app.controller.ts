import { Get, Controller, Res, UseGuards, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';
import { ErrorFilter } from './auth/filters/errors.filter';
import { ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  APP_ACCOUNT_TITLE,
  APP_ACCOUNT_DESCRIPTION,
} from './constants/swagger';
import { INDEX_HTML } from './constants/filesystem';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return this.appService.root();
  }

  @Get('login')
  @ApiExcludeEndpoint() // Exclude from Swagger documentation
  loginForm(@Res() res) {
    res.sendFile(INDEX_HTML);
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

  @Get('settings')
  @UseGuards(EnsureLoginGuard)
  @UseFilters(ErrorFilter)
  settings(@Res() res) {
    res.sendFile(INDEX_HTML);
  }
}
