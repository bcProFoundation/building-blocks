import {
  Controller,
  Get,
  UseGuards,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { switchMap } from 'rxjs/operators';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { ServerSettingsDto } from '../../../system-settings/entities/server-settings/server-setting.dto';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('v1/get')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  getSettings() {
    return this.settingsService.find();
  }

  @Post('v1/update')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateSettings(@Body() payload: ServerSettingsDto) {
    return this.settingsService.find().pipe(
      switchMap(settings => {
        return this.settingsService.update({ uuid: settings.uuid }, payload);
      }),
    );
  }
}
