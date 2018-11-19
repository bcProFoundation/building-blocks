import { TestBed } from '@angular/core/testing';

import { VerifySignupService } from './verify-signup.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VerifySignupService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }),
  );

  it('should be created', () => {
    const service: VerifySignupService = TestBed.get(VerifySignupService);
    expect(service).toBeTruthy();
  });
});
