import {
  Post,
  Controller,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SetupService } from './setup.service';
import { ServerSettingsDto } from '../../models/server-settings/server-setting.dto';

@Controller('setup')
export class SetupController {
  constructor(private readonly settingsService: SetupService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async setup(@Body() icSettingsDTO: ServerSettingsDto) {
    return await this.settingsService.setup(icSettingsDTO);
  }
}
