import { Injectable } from '@nestjs/common';
import { ServerSettingsService } from '../../models/server-settings/server-settings.service';
import { ServerSettings } from '../../models/server-settings/server-settings.entity';
import { Observable, from } from 'rxjs';

@Injectable()
export class SettingsService {
  constructor(private readonly serverSettingsService: ServerSettingsService) {}

  find(): Observable<ServerSettings> {
    const settings = this.serverSettingsService.find();
    return from(settings);
  }

  update(query, params) {
    return from(this.serverSettingsService.update(query, params));
  }
}
