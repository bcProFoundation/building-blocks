import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SetupService } from '../../aggregates/setup/setup.service';
import { ServerSettingsDto } from '../../../system-settings/entities/server-settings/server-setting.dto';

@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async setup(@Body() setupForm: ServerSettingsDto) {
    return await this.setupService.setup(setupForm);
  }
}
