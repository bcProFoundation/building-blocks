import { TestBed } from '@angular/core/testing';

import { EmailService } from './email.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { oauthServiceStub } from '../common/testing-helpers';
import { HttpErrorHandler } from '../common/http-error-handler.service';

describe('EmailService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HttpErrorHandler,
          useValue: {
            createHandleError: (...args) => '',
          },
        },
        {
          provide: OAuthService,
          useValue: oauthServiceStub,
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: EmailService = TestBed.get(EmailService);
    expect(service).toBeTruthy();
  });
});
