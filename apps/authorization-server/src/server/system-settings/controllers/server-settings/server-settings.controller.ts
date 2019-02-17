import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { callback } from '../../../auth/passport/strategies/local.strategy';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { ServerSettingDto } from '../../../system-settings/entities/server-settings/server-setting.dto';
import { SystemSettingsManagementService } from '../../../system-settings/aggregates';

@Controller('settings')
export class ServerSettingsController {
  constructor(
    private readonly settingsManager: SystemSettingsManagementService,
  ) {}

  @Get('v1/get')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  getSettings() {
    return this.settingsManager.getSettings();
  }

  @Post('v1/update')
  @UsePipes(ValidationPipe)
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  updateSettings(@Body() payload: ServerSettingDto) {
    return this.settingsManager.updateSettings(payload);
  }
}
