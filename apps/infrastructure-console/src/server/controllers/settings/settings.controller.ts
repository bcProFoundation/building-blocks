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
import { Roles } from '../../decorators/roles.decorator';
import { TokenGuard } from '../../guards/token.guard';
import { RoleGuard } from '../../guards/role.guard';
import { ADMINISTRATOR } from '../../constants/app-strings';
import { SettingsService } from './settings.service';
import { INDEX_HTML } from '../../constants/filesystem';
import { ServerSettingsDto } from '../../models/server-settings/server-setting.dto';
import { switchMap } from 'rxjs/operators';

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
}
