import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ServerSettings } from './server-settings';

@Injectable()
export class ServerSettingsService {
  constructor(private http: HttpClient) {}

  save(settings: ServerSettings) {
    return this.http.post(environment.routes.SAVE_SETTINGS, settings);
  }

  get() {
    return this.http.get(environment.routes.GET_SETTINGS);
  }
}
