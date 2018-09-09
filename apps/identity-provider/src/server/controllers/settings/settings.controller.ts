import {
  Post,
  Controller,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { IdentityProviderSettingsDto } from 'models/identity-provider-settings/identity-provider-setting.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('wizard')
  @UsePipes(ValidationPipe)
  async setup(@Body() idpSettingsDTO: IdentityProviderSettingsDto) {
    return await this.settingsService.setup(idpSettingsDTO);
  }
}
