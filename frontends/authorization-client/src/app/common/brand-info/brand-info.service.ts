import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { ConnectedServiceNames } from '../../account/connected-services';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandInfoService {
  constructor(private http: HttpClient) {}

  retrieveBrandInfo() {
    return this.http.get<any>('/info').pipe(
      switchMap(authInfo => {
        for (const service of authInfo.services) {
          if (service.type === ConnectedServiceNames.INFRASTRUCTURE_CONSOLE) {
            return this.http.get<any>(service.url + '/brand/v1/retrieve_info');
          }
        }
        return of({});
      }),
    );
  }
}
