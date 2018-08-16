import { Controller, Post, Body } from '@nestjs/common';
import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Post('infrastructure')
  async setupInfrastructure(
    @Body('serverUrl') serverUrl,
    @Body('adminPassword') adminPassword,
  ) {
    return await this.setupService.setupInfrastructureClient(
      serverUrl,
      adminPassword,
    );
  }
}
