import { Test, TestingModule } from '@nestjs/testing';
import { CloudStorageController } from './cloud-storage.controller';
import { HttpService } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { StorageService } from '../../../cloud-storage/entities/storage/storage.service';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

describe('CloudStorage Controller', () => {
  let controller: CloudStorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudStorageController],
      providers: [
        {
          provide: CommandBus,
          useFactory: (...args) => jest.fn(),
        },
        {
          provide: StorageService,
          useFactory: (...args) => jest.fn(),
        },
        {
          provide: TokenCacheService,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: HttpService,
          useFactory: (...args) => jest.fn(),
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();

    controller = module.get<CloudStorageController>(CloudStorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
