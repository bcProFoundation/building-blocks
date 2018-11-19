import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface InfoResponse {
  session?: false;
  message?: any;
}

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

  isAuthenticated(router: Router): Observable<boolean> {
    return this.http.get('/info').pipe(
      map((r: InfoResponse) => {
        if (r.session) {
          return r.session;
        } else {
          router.navigate(['login']);
          return false;
        }
      }),
    );
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

  signUp(
    communicationEnabled: boolean,
    name: string,
    email: string,
    phone: string,
    password: string,
  ) {
    if (communicationEnabled) {
      return this.http.post(environment.routes.SIGNUP_VIA_EMAIL, {
        name,
        email,
      });
    }
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
