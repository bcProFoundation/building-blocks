import {
  Injectable,
  BadRequestException,
  HttpService,
  NotImplementedException,
} from '@nestjs/common';
import {
  INVALID_CODE,
  INVALID_STATE,
  PLEASE_RUN_SETUP,
} from '../../../constants/messages';
import { CALLBACK_PROTOCOL } from '../../../constants/app-strings';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { stringify } from 'querystring';

@Injectable()
export class ConnectedDeviceService {
  constructor(
    private readonly settings: ServerSettingsService,
    private readonly http: HttpService,
  ) {}

  async relayCodeAndState(code: string, state: string, res) {
    const settings = await this.settings.find();
    if (!settings) throw new NotImplementedException(PLEASE_RUN_SETUP);
    const callbackProtocol = settings.callbackProtocol || CALLBACK_PROTOCOL;
    const url = `${callbackProtocol}://callback?code=${code}&state=${state}`;

    if (!code) {
      throw new BadRequestException(INVALID_CODE);
    }
    if (!state) {
      throw new BadRequestException(INVALID_STATE);
    }

    return res.redirect(url);
  }

  async revokeToken(token: string) {
    const settings = await this.settings.find();
    if (!settings) throw new NotImplementedException(PLEASE_RUN_SETUP);
    this.http
      .post(settings.revocationURL, stringify({ token }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: {
          username: settings.clientId,
          password: settings.clientSecret,
        },
      })
      .subscribe({
        next: success => {},
        error: error => {},
      });
  }
}
