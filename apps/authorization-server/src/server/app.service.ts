import { Injectable } from '@nestjs/common';
import { i18n } from './i18n/i18n.config';
import { INDEX_HTML } from './constants/app-strings';
import { ServerSettingsService } from './models/server-settings/server-settings.service';
import { ServerSettings } from './models/interfaces/server-settings.interface';
import { ServiceMessage } from './models/interfaces/service-message.interface';

@Injectable()
export class AppService {
  constructor(private readonly serverSettings: ServerSettingsService) {}

  async info(req?) {
    let settings: ServerSettings;
    const message: ServiceMessage = {
      service: i18n.__('Authorization Server'),
      session: req.isAuthenticated(),
      communication: false,
    };
    try {
      settings = await this.serverSettings.find();
      if (settings.communicationServerClientId) {
        message.communication = true;
      }
    } catch (error) {
      message.communication = false;
    }
    return message;
  }

  login(req, res) {
    if (!req.isAuthenticated()) {
      res.sendFile(INDEX_HTML);
    } else {
      res.redirect(req.query.redirect || '/account');
    }
  }
}
