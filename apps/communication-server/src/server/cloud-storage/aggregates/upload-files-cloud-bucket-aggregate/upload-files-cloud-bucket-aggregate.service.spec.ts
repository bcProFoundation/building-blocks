import { Test, TestingModule } from '@nestjs/testing';
import { UploadFilesCloudBucketAggregateService } from './upload-files-cloud-bucket-aggregate.service';

describe('UploadFilesCloudBucketService', () => {
  let service: UploadFilesCloudBucketAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UploadFilesCloudBucketAggregateService,
          useFactory: (...args) => jest.fn(),
        },
      ],
    }).compile();

    service = module.get<UploadFilesCloudBucketAggregateService>(
      UploadFilesCloudBucketAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
