import { Injectable } from '@nestjs/common';
import { i18n } from './i18n/i18n.config';
import { ServerSettingsService } from './system-settings/entities/server-settings/server-settings.service';
import { ClientService } from './client-management/entities/client/client.service';
import { ServerSettings } from './system-settings/entities/server-settings/server-settings.interface';
import { ServiceMessage } from './common/interfaces/service-message.interface';

@Injectable()
export class AppService {
  constructor(
    private readonly serverSettings: ServerSettingsService,
    private readonly clientService: ClientService,
  ) {}

  async info(req?) {
    let settings: ServerSettings, services;
    const trustedClients = await this.clientService.findAll({
      isTrusted: { $gt: 0 },
    });
    const message: ServiceMessage = {
      service: i18n.__('Authorization Server'),
      session: req.isAuthenticated(),
      communication: false,
    };

    let parsedUrl: URL;
    let url: string;

    try {
      services = trustedClients.map(client => {
        const type = this.kebabCase(client.name);
        try {
          parsedUrl = new URL(client.redirectUris[0]);
          url = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
          if (parsedUrl.port) url += `:${parsedUrl.port}`;
        } catch (error) {
          url = undefined;
        }
        return { type, url };
      });
      message.services = services;
    } catch (error) {
      message.services = [];
    }

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

  kebabCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }
}
