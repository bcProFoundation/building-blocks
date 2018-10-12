import { Get, Controller } from '@nestjs/common';

@Controller()
export class SSRController {
  @Get('*')
  root(): string {
    return '';
  }
}
