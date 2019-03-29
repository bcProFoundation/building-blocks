import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SetupService } from '../../aggregates/setup.service';
import { ServerSettingsDto } from '../../../system-settings/entities/server-settings/server-setting.dto';

@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async setup(@Body() setupForm: ServerSettingsDto) {
    return await this.setupService.setup(setupForm);
  }
}
