import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { StorageService } from '../../../common/services/storage/storage.service';
import { ACCESS_TOKEN, ISSUER_URL } from '../../../constants/storage';

@Injectable({
  providedIn: 'root',
})
export class ClaimsListingService {
  constructor(
    private storageService: StorageService,
    private http: HttpClient,
  ) {}

  findClaims(
    uuid: string,
    filter = '',
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 10,
  ) {
    const baseUrl = this.storageService.getInfo(ISSUER_URL);

    const url = `${baseUrl}/user_claim/v1/retrieve_user_claims?uuid=${uuid}`;

    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('search', filter)
      .set('sort', sortOrder);
    return this.http.get(url, {
      params,
      headers: {
        authorization: `Bearer ${this.storageService.getInfo(ACCESS_TOKEN)}`,
      },
    });
  }
}
