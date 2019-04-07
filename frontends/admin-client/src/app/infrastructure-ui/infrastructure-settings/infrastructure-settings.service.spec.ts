import { TestBed } from '@angular/core/testing';

import { InfrastructureSettingsService } from './infrastructure-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { oauthServiceStub } from '../../common/testing-helpers';

describe('InfrastructureSettingsService', () => {
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
    const service: InfrastructureSettingsService = TestBed.get(
      InfrastructureSettingsService,
    );
    expect(service).toBeTruthy();
  });
});
