import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
  InternalServerErrorException,
  Get,
} from '@nestjs/common';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { callback } from '../../../auth/passport/strategies/local.strategy';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { ServerSettingDto } from '../../../system-settings/entities/server-settings/server-setting.dto';

@Controller('settings')
export class ServerSettingsController {
  constructor(private readonly settingsService: ServerSettingsService) {}

  @Get('v1/get')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async getSettings(@Req() req, @Res() res) {
    const settings = await this.settingsService.find();
    res.json(settings);
  }

  @Post('v1/update')
  @UsePipes(ValidationPipe)
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async save(@Body() payload: ServerSettingDto, @Req() req, @Res() res) {
    try {
      const settings = await this.settingsService.find();
      settings.issuerUrl = payload.issuerUrl;
      if (process.env.NODE_ENV === 'production') {
        settings.communicationServerClientId =
          payload.communicationServerClientId;
      }
      await settings.save();
      res.json({ message: res.__('Success') });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
