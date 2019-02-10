import {
  Controller,
  Get,
  Res,
  UseGuards,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { switchMap } from 'rxjs/operators';
import { INDEX_HTML } from '../../../constants/filesystem';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { ServerSettingsDto } from '../../../system-settings/entities/server-settings/server-setting.dto';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  settings(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Get('v1/get')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  getSettings() {
    return this.settingsService.find();
  }

  @Post('v1/update')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  updateSettings(@Body() payload: ServerSettingsDto) {
    return this.settingsService.find().pipe(
      switchMap(settings => {
        return this.settingsService.update({ uuid: settings.uuid }, payload);
      }),
    );
  }

  @Get('*')
  wildcard(@Res() res) {
    res.sendFile(INDEX_HTML);
  }
}
