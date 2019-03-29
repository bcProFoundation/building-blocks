import { TestBed } from '@angular/core/testing';

import { RoleService } from './role.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorHandler } from '../common/http-error-handler.service';
import { MessageService } from '../common/message.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { oauthServiceStub } from '../common/testing-helpers';

describe('RoleService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpErrorHandler,
        MessageService,
        {
          provide: OAuthService,
          useValue: oauthServiceStub,
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: RoleService = TestBed.get(RoleService);
    expect(service).toBeTruthy();
  });
});
