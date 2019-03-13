import { TestBed } from '@angular/core/testing';

import { CloudStorageService } from './cloud-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageService } from '../common/storage.service';

describe('CloudStorageService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: StorageService,
          useValue: {
            getInfo: (...arga) => {},
          },
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: CloudStorageService = TestBed.get(CloudStorageService);
    expect(service).toBeTruthy();
  });
});
