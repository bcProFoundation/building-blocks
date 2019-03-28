import { Get, Controller, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ACCOUNTS_ROUTE } from './constants/app-strings';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(@Res() res) {
    res.redirect(ACCOUNTS_ROUTE);
  }

  @Get('info')
  info(@Req() req?) {
    return this.appService.info(req);
  }
}
