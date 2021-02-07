import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VerifyGeneratePasswordService {
  constructor(private readonly http: HttpClient) {}
  updateUser(verificationCode: string, password: string) {
    return this.http.post(environment.routes.GENERATE_PASSWORD, {
      verificationCode,
      password,
    });
  }

  verifyEmail(verificationCode: string) {
    return this.http.post(environment.routes.VERIFY_EMAIL, {
      verificationCode,
    });
  }
}
