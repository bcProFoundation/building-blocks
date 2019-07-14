import { TestBed } from '@angular/core/testing';

import { BrandInfoService } from './brand-info.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BrandInfoService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }),
  );

  it('should be created', () => {
    const service: BrandInfoService = TestBed.get(BrandInfoService);
    expect(service).toBeTruthy();
  });
});
