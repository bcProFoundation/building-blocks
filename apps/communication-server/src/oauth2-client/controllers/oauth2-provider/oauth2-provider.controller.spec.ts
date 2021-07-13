import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { Reflector } from '@nestjs/core';
import { Oauth2ProviderController } from './oauth2-provider.controller';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';

describe('Oauth2Provider Controller', () => {
  let controller: Oauth2ProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: CommandBus, useValue: {} },
        { provide: QueryBus, useValue: {} },
        { provide: Reflector, useValue: {} },
        { provide: HttpService, useValue: {} },
        { provide: ServerSettingsService, useValue: {} },
        { provide: TokenCacheService, useValue: {} },
      ],
      controllers: [Oauth2ProviderController],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();

    controller = module.get<Oauth2ProviderController>(Oauth2ProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
