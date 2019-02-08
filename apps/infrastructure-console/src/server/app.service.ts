import { Injectable } from '@nestjs/common';
import { PLEASE_RUN_SETUP } from './constants/messages';
import { SetupService } from './system-settings/aggregates/setup/setup.service';

@Injectable()
export class AppService {
  constructor(private readonly setupService: SetupService) {}
  async info() {
    const info = (await this.setupService.getInfo()) || {
      message: PLEASE_RUN_SETUP,
    };
    return info;
  }
}
