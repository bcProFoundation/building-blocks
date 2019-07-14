import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_URL } from '../../constants/storage';

export const RETRIEVE_BRAND_INFO = '/brand/v1/retrieve_info';
export const UPDATE_BRAND_INFO = '/brand/v1/update_info';

@Injectable({
  providedIn: 'root',
})
export class BrandSettingsService {
  constructor(private http: HttpClient) {}

  updateSettings(
    logoURL: string = '',
    faviconURL: string = '',
    privacyURL: string = '',
    termsURL: string = '',
    helpURL: string = '',
    copyrightMessage: string = '',
    primaryColor: string = '',
    accentColor: string = '',
    warnColor: string = '',
    foregroundColor: string = '',
    backgroundColor: string = '',
  ) {
    const appURL = localStorage.getItem(APP_URL);
    return this.http.post(appURL + UPDATE_BRAND_INFO, {
      logoURL,
      faviconURL,
      privacyURL,
      termsURL,
      helpURL,
      copyrightMessage,
      primaryColor,
      accentColor,
      warnColor,
      foregroundColor,
      backgroundColor,
    });
  }

  retrieveSettings() {
    const appURL = localStorage.getItem(APP_URL);
    return this.http.get(appURL + RETRIEVE_BRAND_INFO);
  }
}
