import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('info')
  async info() {
    return await this.appService.info();
  }
}
