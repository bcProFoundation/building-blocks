import {
  Controller,
  Body,
  Res,
  Post,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { ServerSettingsService } from '../../models/server-settings/server-settings.service';
import { ServerSettingsUpdateDto } from '../../models/server-settings/server-setting-update.dto';
import { BearerTokenStatus } from '../../decorators/bearer-token.decorator';
import { ADMINISTRATOR } from '../../constants/app-strings';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: ServerSettingsService) {}

  @Post('v1/update')
  @UsePipes(ValidationPipe)
  async updateSettings(
    @Body() payload: ServerSettingsUpdateDto,
    @Res() res,
    @BearerTokenStatus() token,
  ) {
    if (!token.roles.includes(ADMINISTRATOR)) throw new UnauthorizedException();
    const updateResponse = await this.settingsService.update(
      { uuid: payload.uuid },
      payload,
    );
    res.json(updateResponse);
  }
}
