import { TestBed } from '@angular/core/testing';

import { ListingService } from './listing.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorHandler } from '../../common/services/http-error-handler/http-error-handler.service';

describe('ListingService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HttpErrorHandler,
          useValue: {
            handleError<T>(...args) {},
            createHandleError(...args) {},
          },
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: ListingService = TestBed.get(ListingService);
    expect(service).toBeTruthy();
  });
});
