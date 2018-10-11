import { Injectable } from '@nestjs/common';
import { SetupService } from './controllers/setup/setup.service';
import { PLEASE_RUN_SETUP } from './constants/messages';

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
