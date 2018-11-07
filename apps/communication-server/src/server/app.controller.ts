import { Get, Controller, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { INDEX_HTML } from './constants/filesystem';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(@Res() res) {
    res.sendFile(INDEX_HTML);
  }

  @Get('home*')
  home(@Res() res) {
    res.sendFile(INDEX_HTML);
  }

  @Get('info')
  async info() {
    return await this.appService.info();
  }
}
