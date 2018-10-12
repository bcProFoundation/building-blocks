import {
  Post,
  Controller,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SetupService } from './setup.service';
import { IdentityProviderSettingsDto } from '../../models/identity-provider-settings/identity-provider-setting.dto';

@Controller('setup')
export class SetupController {
  constructor(private readonly settingsService: SetupService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async setup(@Body() idpSettingsDTO: IdentityProviderSettingsDto) {
    return await this.settingsService.setup(idpSettingsDTO);
  }
}
