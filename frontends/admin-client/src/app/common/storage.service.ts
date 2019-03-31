import { Injectable } from '@angular/core';
import {
  CLIENT_ID,
  REDIRECT_URI,
  SILENT_REFRESH_REDIRECT_URI,
  LOGIN_URL,
  ISSUER_URL,
  USER_UUID,
  APP_URL,
  SERVICES,
  COMMUNICATION,
} from '../constants/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  clearInfoLocalStorage() {
    localStorage.removeItem(CLIENT_ID);
    localStorage.removeItem(REDIRECT_URI);
    localStorage.removeItem(SILENT_REFRESH_REDIRECT_URI);
    localStorage.removeItem(LOGIN_URL);
    localStorage.removeItem(ISSUER_URL);
    localStorage.removeItem(USER_UUID);
  }

  setInfoLocalStorage(response) {
    localStorage.setItem(CLIENT_ID, response.clientId);
    localStorage.setItem(REDIRECT_URI, response.callbackURLs[0]);
    localStorage.setItem(SILENT_REFRESH_REDIRECT_URI, response.callbackURLs[1]);
    localStorage.setItem(LOGIN_URL, response.authorizationURL);
    localStorage.setItem(ISSUER_URL, response.authServerURL);
    localStorage.setItem(APP_URL, response.appURL);
    localStorage.setItem(SERVICES, JSON.stringify(response.services));
    localStorage.setItem(COMMUNICATION, response.communication);
  }

  getServiceURL(serviceName) {
    const services = JSON.parse(localStorage.getItem(SERVICES) || '[]');
    for (const service of services) {
      if (service.type === serviceName) {
        return service.url;
      }
    }
    return undefined;
  }

  getInfo(key) {
    return localStorage.getItem(key);
  }
}
