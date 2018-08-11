import {
  Get,
  Controller,
  Render,
  Req,
  Res,
  UseGuards,
  UseFilters,
} from '@nestjs/common';

@Controller()
export class SSRController {
  @Get('*')
  root(): string {
    return '';
  }
}
