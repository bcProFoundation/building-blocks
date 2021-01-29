import {
  Controller,
  Query,
  Get,
  Res,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { ConnectedDeviceService } from '../../aggregates/connected-device/connected-device.service';
import { TokenGuard } from '../../guards/token.guard';

@Controller('connected_device')
export class ConnectedDeviceController {
  constructor(private readonly service: ConnectedDeviceService) {}

  @Get('callback')
  async relayCodeAndState(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res,
  ) {
    return await this.service.relayCodeAndState(code, state, res);
  }

  @Post('revoke_token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(TokenGuard)
  async revokeToken(@Body('token') token) {
    await this.service.revokeToken(token);
  }
}
