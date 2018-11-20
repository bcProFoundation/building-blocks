import {
  Controller,
  Body,
  Res,
  Post,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { ServerSettingsService } from '../../models/server-settings/server-settings.service';
import { ServerSettingsUpdateDto } from '../../models/server-settings/server-setting-update.dto';
import { BearerTokenStatus } from '../../decorators/bearer-token.decorator';
import { ADMINISTRATOR } from '../../constants/app-strings';
import { INDEX_HTML } from '../../constants/filesystem';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: ServerSettingsService) {}

  @Get('v1/get')
  async getSettings(@BearerTokenStatus() token) {
    if (!token.roles.includes(ADMINISTRATOR)) throw new UnauthorizedException();
    return await this.settingsService.find();
  }

  @Post('v1/update')
  @UsePipes(ValidationPipe)
  async updateSettings(
    @Body() payload: ServerSettingsUpdateDto,
    @Res() res,
    @BearerTokenStatus() token,
  ) {
    if (!token.roles.includes(ADMINISTRATOR)) throw new UnauthorizedException();
    const settings = await this.settingsService.find();
    const updateResponse = await this.settingsService.update(
      { uuid: settings.uuid },
      payload,
    );
    res.json(updateResponse);
  }

  @Get()
  settings(@Res() res) {
    res.sendFile(INDEX_HTML);
  }
}
