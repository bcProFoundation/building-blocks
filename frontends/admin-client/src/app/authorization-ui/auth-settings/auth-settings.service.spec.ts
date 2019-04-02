import { TestBed } from '@angular/core/testing';

import { AuthSettingsService } from './auth-settings.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { oauthServiceStub } from '../../common/testing-helpers';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthSettingsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: OAuthService,
          useValue: oauthServiceStub,
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: AuthSettingsService = TestBed.get(AuthSettingsService);
    expect(service).toBeTruthy();
  });
});
