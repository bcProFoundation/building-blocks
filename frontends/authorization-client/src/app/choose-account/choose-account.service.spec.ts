import { TestBed } from '@angular/core/testing';

import { ChooseAccountService } from './choose-account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChooseAccountService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }),
  );

  it('should be created', () => {
    const service: ChooseAccountService = TestBed.get(ChooseAccountService);
    expect(service).toBeTruthy();
  });
});
