import { Injectable } from '@nestjs/common';
import { SetupService } from './system-settings/controllers/setup/setup.service';
import { PLEASE_RUN_SETUP } from './constants/messages';

@Injectable()
export class AppService {
  constructor(private readonly idpSetupService: SetupService) {}
  async info() {
    const info = (await this.idpSetupService.getInfo()) || {
      message: PLEASE_RUN_SETUP,
    };
    return info;
  }
}
