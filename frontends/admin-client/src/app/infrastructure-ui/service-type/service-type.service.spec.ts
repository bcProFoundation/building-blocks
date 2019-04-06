import { TestBed } from '@angular/core/testing';

import { ServiceTypeService } from './service-type.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorHandler } from '../../common/services/http-error-handler/http-error-handler.service';
import { MessageService } from '../../common/services/message/message.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { oauthServiceStub } from '../../common/testing-helpers';

describe('ServiceTypeService', () => {
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
    const service: ServiceTypeService = TestBed.get(ServiceTypeService);
    expect(service).toBeTruthy();
  });
});
