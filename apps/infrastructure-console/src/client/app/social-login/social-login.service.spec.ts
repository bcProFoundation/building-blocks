import { TestBed } from '@angular/core/testing';

import { SocialLoginService } from './social-login.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SocialLoginService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }),
  );

  it('should be created', () => {
    const service: SocialLoginService = TestBed.get(SocialLoginService);
    expect(service).toBeTruthy();
  });
});
