import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTypeController } from './service-type.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { HttpService } from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';

describe('ServiceType Controller', () => {
  let controller: ServiceTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [ServiceTypeController],
      providers: [
        { provide: ServerSettingsService, useValue: {} },
        { provide: TokenCacheService, useValue: {} },
        { provide: HttpService, useValue: {} },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();

    controller = module.get<ServiceTypeController>(ServiceTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
