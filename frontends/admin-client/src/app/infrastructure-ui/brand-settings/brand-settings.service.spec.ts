import { TestBed } from '@angular/core/testing';

import { BrandSettingsService } from './brand-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BrandSettingsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }),
  );

  it('should be created', () => {
    const service: BrandSettingsService = TestBed.get(BrandSettingsService);
    expect(service).toBeTruthy();
  });
});
