import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { invalidClientException } from '../../../common/filters/exceptions';
import { AggregateRoot } from '@nestjs/cqrs';
import { SystemSettingsChangedEvent } from '../../events/server-settings-changed/server-settings-changed.event';
import { ServerSettingDto } from '../../entities/server-settings/server-setting.dto';

@Injectable()
export class SystemSettingsManagementService extends AggregateRoot {
  constructor(
    private readonly settingsService: ServerSettingsService,
    private readonly clientService: ClientService,
  ) {
    super();
  }

  async updateSettings(actorUserUuid: string, payload: ServerSettingDto) {
    const settings = await this.settingsService.find();
    if (payload.issuerUrl) settings.issuerUrl = payload.issuerUrl;
    if (payload.disableSignup) settings.disableSignup = payload.disableSignup;
    if (
      payload.communicationServerClientId &&
      ['production', 'development'].includes(process.env.NODE_ENV)
    ) {
      const client = await this.clientService.findOne({
        clientId: payload.communicationServerClientId,
      });
      if (!client) throw invalidClientException;
      settings.communicationServerClientId =
        payload.communicationServerClientId;
    }
    this.apply(new SystemSettingsChangedEvent(actorUserUuid, settings));
  }

  getSettings() {
    return from(this.settingsService.find());
  }
}
