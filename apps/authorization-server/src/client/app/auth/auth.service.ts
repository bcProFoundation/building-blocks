import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    private activatedroute: ActivatedRoute,
  ) {
    this.activatedroute.queryParams.subscribe(params => {
      if (params.redirect) {
        if (!environment.production) {
          this.redirectTo = `/dev${params.redirect}`;
        } else {
          this.redirectTo = params.redirect;
        }
      } else {
        this.redirectTo = '/account';
      }
    });
  }

  public redirectTo;

  isAuthenticated(): boolean {
    return true;
    // TODO: Check if session exists.
  }

  logIn(email: string, password: string) {
    this.http
      .post(environment.routes.LOGIN, {
        email,
        password,
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
}
