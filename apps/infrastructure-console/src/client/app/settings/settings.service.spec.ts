import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { oauthServiceStub } from '../common/testing-helpers';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SettingsService', () => {
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
    const service: SettingsService = TestBed.get(SettingsService);
    expect(service).toBeTruthy();
  });
});
