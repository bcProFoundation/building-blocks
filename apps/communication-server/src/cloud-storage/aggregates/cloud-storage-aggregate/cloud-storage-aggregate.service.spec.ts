import { Test, TestingModule } from '@nestjs/testing';
import { CloudStorageAggregateService } from './cloud-storage-aggregate.service';

describe('CloudStorageAggregateService', () => {
  let service: CloudStorageAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CloudStorageAggregateService,
          useFactory: (...args) => jest.fn(),
        },
      ],
    }).compile();

    service = module.get<CloudStorageAggregateService>(
      CloudStorageAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
