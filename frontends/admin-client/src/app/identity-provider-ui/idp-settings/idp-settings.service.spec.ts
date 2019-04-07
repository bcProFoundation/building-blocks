import { TestBed } from '@angular/core/testing';

import { IdpSettingsService } from './idp-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { oauthServiceStub } from '../../common/testing-helpers';

describe('IdpSettingsService', () => {
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
    const service: IdpSettingsService = TestBed.get(IdpSettingsService);
    expect(service).toBeTruthy();
  });
});
