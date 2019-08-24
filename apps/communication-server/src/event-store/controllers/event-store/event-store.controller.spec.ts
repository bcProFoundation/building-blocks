import { Test, TestingModule } from '@nestjs/testing';
import { EventStoreController } from './event-store.controller';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { HttpService } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

describe('EventStore Controller', () => {
  let controller: EventStoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventStoreController],
      providers: [
        { provide: QueryBus, useValue: {} },
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

    controller = module.get<EventStoreController>(EventStoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
