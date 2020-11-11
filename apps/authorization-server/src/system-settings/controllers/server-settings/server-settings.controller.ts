import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { ServerSettingDto } from '../../entities/server-settings/server-setting.dto';
import { SystemSettingsManagementService } from '../../../system-settings/aggregates';
import { ChangeServerSettingsCommand } from '../../commands/change-server-settings/change-server-settings.command';
import { DeleteUserSessionsCommand } from '../../commands/delete-user-sessions/delete-user-sessions.command';
import { DeleteBearerTokensCommand } from '../../commands/delete-bearer-tokens/delete-bearer-tokens.command';
import { BearerTokenGuard } from '../../../auth/guards/bearer-token.guard';

@Controller('settings')
export class ServerSettingsController {
  constructor(
    private readonly settingsManager: SystemSettingsManagementService,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('v1/get')
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  getSettings() {
    return this.settingsManager.getSettings();
  }

  @Post('v1/update')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  async updateSettings(@Body() payload: ServerSettingDto, @Req() req) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new ChangeServerSettingsCommand(actorUserUuid, payload),
    );
  }

  @Post('v1/delete_bearer_tokens')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  async deleteTokens(@Req() req) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new DeleteBearerTokensCommand(actorUserUuid),
    );
  }

  @Post('v1/delete_user_sessions')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  async deleteSessions(@Req() req) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new DeleteUserSessionsCommand(actorUserUuid),
    );
  }
}
