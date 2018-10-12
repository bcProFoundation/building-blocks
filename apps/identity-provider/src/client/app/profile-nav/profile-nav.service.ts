import { Injectable } from '@angular/core';
import {
  CLIENT_ID,
  REDIRECT_URI,
  SILENT_REFRESH_REDIRECT_URI,
  LOGIN_URL,
  ISSUER_URL,
  USER_UUID,
} from '../../constants/storage';

@Injectable()
export class ProfileNavService {
  clearInfoLocalStorage() {
    localStorage.removeItem(CLIENT_ID);
    localStorage.removeItem(REDIRECT_URI);
    localStorage.removeItem(SILENT_REFRESH_REDIRECT_URI);
    localStorage.removeItem(LOGIN_URL);
    localStorage.removeItem(ISSUER_URL);
    localStorage.removeItem(USER_UUID);
  }
}
