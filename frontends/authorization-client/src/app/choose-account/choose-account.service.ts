import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ChooseAccountService {
  constructor(private http: HttpClient) {}

  getSessionUsers() {
    return this.http.get(environment.routes.LIST_SESSION_USERS);
  }

  chooseUser(uuid) {
    return this.http.post(environment.routes.CHOOSE_USER, { uuid });
  }

  logoutUser(uuid) {
    return this.http.get(
      environment.routes.LOGOUT + '/' + uuid + '?redirect=%2Faccount%2Fchoose',
    );
  }
}
