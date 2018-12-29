import {
  Controller,
  Get,
  Res,
  UsePipes,
  ValidationPipe,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import { INDEX_HTML } from '../../constants/filesystem';
import { ServerSettingsService } from '../../models/server-settings/server-settings.service';
import { ServerSettingsDto } from '../../models/server-settings/server-setting.dto';
import { ADMINISTRATOR } from '../../constants/app-strings';
import { TokenGuard } from '../../guards/token.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: ServerSettingsService) {}

  @Get('v1/get')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async getSettings() {
    return await this.settingsService.find();
  }

  @Post('v1/update')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  async updateSettings(@Body() payload: ServerSettingsDto, @Res() res) {
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
