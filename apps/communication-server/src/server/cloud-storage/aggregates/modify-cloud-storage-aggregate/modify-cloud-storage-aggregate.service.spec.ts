import { Test, TestingModule } from '@nestjs/testing';
import { ModifyCloudStorageAggregateService } from './modify-cloud-storage-aggregate.service';

describe('ModifyCloudStorageAggregateService', () => {
  let service: ModifyCloudStorageAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ModifyCloudStorageAggregateService,
          useFactory: (...args) => jest.fn(),
        },
      ],
    }).compile();

    service = module.get<ModifyCloudStorageAggregateService>(
      ModifyCloudStorageAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
