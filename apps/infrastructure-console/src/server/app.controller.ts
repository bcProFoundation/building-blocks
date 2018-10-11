import { Get, Controller, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { INDEX_HTML } from './constants/filesystem';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Get('home')
  home(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Get('profile')
  profile(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Get('client')
  apps(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Get('client/:id')
  appsWithID(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Get('scopes')
  scopes(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Get('info')
  async info() {
    return await this.appService.info();
  }
}
