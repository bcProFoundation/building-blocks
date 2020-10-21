import { TestBed } from '@angular/core/testing';

import { ClaimsListingService } from './claims-listing.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageService } from '../../../common/services/storage/storage.service';

describe('ClaimsListingService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: StorageService,
          useValue: {
            getInfo: key => '',
          },
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: ClaimsListingService = TestBed.get(ClaimsListingService);
    expect(service).toBeTruthy();
  });
});
