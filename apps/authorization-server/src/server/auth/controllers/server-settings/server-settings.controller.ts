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

  @Get('v1/get')
  @UseGuards(AuthGuard('bearer', { callback }))
  async getSettings(@Req() req, @Res() res) {
    await this.userService.checkAdministrator(req.user.user);
    const settings = await this.settingsService.find();
    res.json(settings);
  }

  @Post('v1/update')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('bearer', { callback }))
  async save(@Body() payload: ServerSettingDto, @Req() req, @Res() res) {
    await this.userService.checkAdministrator(req.user.user);
    try {
      const settings = await this.settingsService.find();
      settings.issuerUrl = payload.issuerUrl;
      settings.communicationServerClientId =
        payload.communicationServerClientId;
      await settings.save();
      res.json({ message: res.__('Success') });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
