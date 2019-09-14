import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthenticationKeysService } from './authentication-keys.service';

describe('AuthenticationKeysService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }),
  );

  it('should be created', () => {
    const service: AuthenticationKeysService = TestBed.get(
      AuthenticationKeysService,
    );
    expect(service).toBeTruthy();
  });
});
