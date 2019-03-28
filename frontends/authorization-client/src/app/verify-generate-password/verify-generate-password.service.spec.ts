import { TestBed } from '@angular/core/testing';

import { VerifyGeneratePasswordService } from './verify-generate-password.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VerifyGeneratePasswordService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }),
  );

  it('should be created', () => {
    const service: VerifyGeneratePasswordService = TestBed.get(
      VerifyGeneratePasswordService,
    );
    expect(service).toBeTruthy();
  });
});
