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
} from '@nestjs/common';
import { ServerSettingsService } from '../../../models/server-settings/server-settings.service';
import { ServerSettingDto } from '../../../models/server-settings/server-setting.dto';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { callback } from '../../../auth/passport/local.strategy';
import { UserService } from '../../../models/user/user.service';

@Controller('settings')
export class ServerSettingsController {
  constructor(
    private readonly settingsService: ServerSettingsService,
    private readonly userService: UserService,
  ) {}

  @Post('v1/update')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('bearer', { callback }))
  async save(@Body() settings: ServerSettingDto, @Req() req, @Res() res) {
    await this.userService.checkAdministrator(req.user.user);
    try {
      await this.settingsService.update({ uuid: settings.uuid }, settings);
      res.json({ message: res.__('Success') });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
