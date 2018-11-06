import { TestBed } from '@angular/core/testing';

import { MultifactorService } from './multifactor.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { oauthServiceStub } from '../common/testing-helpers';

describe('MultifactorService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: OAuthService,
          useValue: oauthServiceStub,
        },
      ],
    }));

  it('should be created', () => {
    const service: MultifactorService = TestBed.get(MultifactorService);
    expect(service).toBeTruthy();
  });
});
