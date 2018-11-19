import { Injectable } from '@nestjs/common';
import { i18n } from './i18n/i18n.config';
import { INDEX_HTML } from './constants/app-strings';
import { ServerSettingsService } from './models/server-settings/server-settings.service';

@Injectable()
export class AppService {
  constructor(private readonly serverSettings: ServerSettingsService) {}

  async info(req?) {
    const settings = await this.serverSettings.find();
    return {
      message: i18n.__('Authorization Server'),
      communication: settings.communicationServerClientId ? true : false,
      session: req.isAuthenticated(),
    };
  }

  login(req, res) {
    if (!req.isAuthenticated()) {
      res.sendFile(INDEX_HTML);
    } else {
      res.redirect(req.query.redirect || '/account');
    }
  }
}
