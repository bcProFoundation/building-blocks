import {
  Controller,
  Get,
  UnauthorizedException,
  Res,
  UsePipes,
  ValidationPipe,
  Body,
  Post,
} from '@nestjs/common';
import { BearerTokenStatus } from '../../decorators/bearer-token-status.decorator';
import { INDEX_HTML } from '../../constants/filesystem';
import { IdentityProviderSettingsService } from '../../models/identity-provider-settings/identity-provider-settings.service';
import { IdentityProviderSettingsDto } from '../../models/identity-provider-settings/identity-provider-setting.dto';
import { ADMINISTRATOR } from '../../constants/app-strings';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: IdentityProviderSettingsService,
  ) {}

  @Get('v1/get')
  async getSettings(@BearerTokenStatus() token) {
    if (!token.roles.includes(ADMINISTRATOR)) throw new UnauthorizedException();
    return await this.settingsService.find();
  }

  @Post('v1/update')
  @UsePipes(ValidationPipe)
  async updateSettings(
    @Body() payload: IdentityProviderSettingsDto,
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
