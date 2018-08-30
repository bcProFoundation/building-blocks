import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import { ServerSettingsService } from '../../../models/server-settings/server-settings.service';
import { ServerSettingDto } from '../../../models/server-settings/server-setting.dto';

@Controller('v1/settings')
export class ServerSettingsController {
  constructor(private readonly settingsService: ServerSettingsService) {}

  @Post('save')
  @UsePipes(new ValidationPipe())
  async save(@Body() settings: ServerSettingDto) {
    return await this.settingsService.save(settings);
  }

  @Get('get')
  async get() {
    return await this.settingsService.find();
  }
}
