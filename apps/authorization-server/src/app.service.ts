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
    this.serverSettings.find();

    const message: ServiceMessage = {
      service: i18n.__('Authorization Server'),
      session: req.isAuthenticated(),
      communication: false,
    };

    let parsedUrl: URL;
    let url: string;

    try {
      settings = await this.serverSettings.find();

      const trustedClients = await this.clientService.findAll({
        clientId: {
          $in: [
            settings.identityProviderClientId,
            settings.infrastructureConsoleClientId,
            settings.communicationServerClientId,
          ],
        },
        isTrusted: { $gt: 0 },
      });
      services = trustedClients.map(client => {
        const type = this.getServiceName(client.clientId, settings);
        try {
          parsedUrl = new URL(client.redirectUris[0]);
          url = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
          if (parsedUrl.port) url += `:${parsedUrl.port}`;
        } catch (error) {
          url = undefined;
        }
        return { type, url };
      });

      if (settings.communicationServerClientId) {
        message.communication = true;
      }
    } catch (error) {
      message.communication = false;
      services = [];
    }

    message.services = services;

    return message;
  }

  getServiceName(clientId: string, settings: ServerSettings) {
    switch (clientId) {
      case settings.infrastructureConsoleClientId:
        return ConnectedServiceNames.INFRASTRUCTURE_CONSOLE;
      case settings.communicationServerClientId:
        return ConnectedServiceNames.COMMUNICATION_SERVER;
      case settings.identityProviderClientId:
        return ConnectedServiceNames.IDENTITY_PROVIDER;
    }
  }
}

export enum ConnectedServiceNames {
  INFRASTRUCTURE_CONSOLE = 'infrastructure-console',
  COMMUNICATION_SERVER = 'communication-server',
  IDENTITY_PROVIDER = 'identity-provider',
}
