import { Injectable } from '@nestjs/common';
import { from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { invalidClientException } from '../../../common/filters/exceptions';

@Injectable()
export class SystemSettingsManagementService {
  constructor(
    private readonly settingsService: ServerSettingsService,
    private readonly clientService: ClientService,
  ) {}

  updateSettings(payload) {
    return from(this.settingsService.find()).pipe(
      switchMap(settings => {
        settings.issuerUrl = payload.issuerUrl;
        if (['production', 'development'].includes(process.env.NODE_ENV)) {
          return from(
            this.clientService.findOne({
              clientId: payload.communicationServerClientId,
            }),
          ).pipe(
            switchMap(client => {
              if (!client) return throwError(invalidClientException);
              settings.communicationServerClientId =
                payload.communicationServerClientId;
              return from(settings.save());
            }),
          );
        }
        return from(settings.save());
      }),
    );
  }

  getSettings() {
    return from(this.settingsService.find());
  }
}
