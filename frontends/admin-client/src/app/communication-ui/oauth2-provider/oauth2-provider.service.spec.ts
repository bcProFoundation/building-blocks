import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { OAuth2ProviderService } from './oauth2-provider.service';
import { oauthServiceStub } from '../../common/testing-helpers';

describe('OAuth2ProviderService', () => {
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
    const service: OAuth2ProviderService = TestBed.get(OAuth2ProviderService);
    expect(service).toBeTruthy();
  });
});
