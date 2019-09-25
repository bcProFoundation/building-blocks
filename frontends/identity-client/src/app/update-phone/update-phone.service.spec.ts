import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UpdatePhoneService } from './update-phone.service';
import { OAuthService } from 'angular-oauth2-oidc';

describe('UpdatePhoneService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: OAuthService,
          useValue: {},
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: UpdatePhoneService = TestBed.get(UpdatePhoneService);
    expect(service).toBeTruthy();
  });
});
