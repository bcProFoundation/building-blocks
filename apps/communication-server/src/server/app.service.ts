import { Injectable } from '@nestjs/common';
import { PLEASE_RUN_SETUP } from './constants/messages';
import { SetupService } from './controllers/setup/setup.service';

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
