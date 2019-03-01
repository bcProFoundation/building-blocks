import { Test, TestingModule } from '@nestjs/testing';
import { ProfileManagerAggregateService } from './profile-manager-aggregate.service';
import { UploadAvatarMetaDataService } from '../../../profile-management/policies/upload-avatar-meta-data/upload-avatar-meta-data.service';

describe('ProfileManagerAggregateService', () => {
  let service: ProfileManagerAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProfileManagerAggregateService,
          useFactory: (...args) => jest.fn(),
        },
        {
          provide: UploadAvatarMetaDataService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProfileManagerAggregateService>(
      ProfileManagerAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
