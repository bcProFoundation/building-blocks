import { Test, TestingModule } from '@nestjs/testing';
import { UploadAvatarMetaDataService } from './upload-avatar-meta-data.service';
import { HttpService } from '@nestjs/axios';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

describe('UploadAvatarMetaDataService', () => {
  let service: UploadAvatarMetaDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadAvatarMetaDataService,
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UploadAvatarMetaDataService>(
      UploadAvatarMetaDataService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
