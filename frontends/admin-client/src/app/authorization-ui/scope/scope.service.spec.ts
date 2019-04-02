import { TestBed } from '@angular/core/testing';

import { ScopeService } from './scope.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorHandler } from '../../common/services/http-error-handler/http-error-handler.service';
import { MessageService } from '../../common/services/message/message.service';

describe('ScopeService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpErrorHandler, MessageService],
    }),
  );

  it('should be created', () => {
    const service: ScopeService = TestBed.get(ScopeService);
    expect(service).toBeTruthy();
  });
});
