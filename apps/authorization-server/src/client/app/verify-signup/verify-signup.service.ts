import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class VerifySignupService {
  constructor(private readonly http: HttpClient) {}
  updateUser(verificationCode: string, password: string) {
    return this.http.post(environment.routes.VERIFY_SIGNUP_CODE, {
      verificationCode,
      password,
    });
  }
}
