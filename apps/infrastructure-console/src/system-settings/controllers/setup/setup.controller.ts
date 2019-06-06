import {
  Post,
  Controller,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SetupService } from '../../../system-settings/aggregates/setup/setup.service';
import { ServerSettingsDto } from '../../../system-settings/entities/server-settings/server-setting.dto';

@Controller('setup')
export class SetupController {
  constructor(private readonly settingsService: SetupService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async setup(@Body() icSettingsDTO: ServerSettingsDto) {
    return await this.settingsService.setup(icSettingsDTO);
  }
}
