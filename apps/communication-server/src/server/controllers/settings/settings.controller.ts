import {
  Controller,
  Body,
  Res,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ServerSettingsService } from '../../models/server-settings/server-settings.service';
import { ServerSettingsUpdateDto } from '../../models/server-settings/server-setting-update.dto';
import { ADMINISTRATOR } from '../../constants/app-strings';
import { INDEX_HTML } from '../../constants/filesystem';
import { TokenGuard } from '../../guards/token.guard';
import { Roles } from '../../decorators/roles.decorator';
import { RoleGuard } from '../../guards/role.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: ServerSettingsService) {}

  @Get()
  settings(@Res() res) {
    res.sendFile(INDEX_HTML);
  }

  @Get('v1/get')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async getSettings(@Req() req) {
    return await this.settingsService.find();
  }

  @Post('v1/update')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  async updateSettings(
    @Body() payload: ServerSettingsUpdateDto,
    @Req() req,
    @Res() res,
  ) {
    const settings = await this.settingsService.find();
    const updateResponse = await this.settingsService.update(
      { uuid: settings.uuid },
      payload,
    );
    res.json(updateResponse);
  }
}
