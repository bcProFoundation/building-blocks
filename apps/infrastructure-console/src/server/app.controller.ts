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

  @Get('dashboard')
  dashboard(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Get('client*')
  apps(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Get('scope*')
  scopes(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Get('role*')
  roles(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Get('user*')
  users(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Get('settings*')
  settings(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Get('info')
  async info() {
    return await this.appService.info();
  }
}
