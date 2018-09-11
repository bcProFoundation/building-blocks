import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
  public redirectTo;

  constructor(
    private http: HttpClient,
    private activatedroute: ActivatedRoute,
  ) {
    this.activatedroute.queryParams.subscribe(params => {
      if (params.redirect) {
        this.redirectTo = params.redirect;
      } else {
        this.redirectTo = '/account';
      }
    });
  }

  isAuthenticated(): boolean {
    return true;
    // TODO: Check if session exists.
  }

  logIn(username: string, password: string, code?: string) {
    this.http
      .post(environment.routes.LOGIN, {
        username,
        password,
        code,
        redirect: this.redirectTo,
      })
      .subscribe({
        next: (response: any) => {
          window.location.href = response.path;
        },
      });
  }

  signUp(name: string, email: string, phone: string, password: string) {
    return this.http.post(environment.routes.SIGNUP, {
      name,
      email,
      phone,
      password,
    });
  }

  authorize(transactionId: string, consent: string = 'Allow') {
    return this.http.post(environment.routes.AUTHORIZE, {
      value: consent,
      transaction_id: transactionId,
    });
  }

  verifyUser(username: string) {
    return this.http.post(environment.routes.CHECK_USER, {
      username,
    });
  }
}
