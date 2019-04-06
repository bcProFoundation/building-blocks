import { TestBed } from '@angular/core/testing';

import { CommunicationSettingsService } from './communication-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { oauthServiceStub } from '../../common/testing-helpers';

describe('CommunicationSettingsService', () => {
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
    const service: CommunicationSettingsService = TestBed.get(
      CommunicationSettingsService,
    );
    expect(service).toBeTruthy();
  });
});
