import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { OAuth2Service } from './oauth2.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientService } from 'client-management/entities/client/client.service';
import { CqrsModule } from '@nestjs/cqrs';

describe('OAuth2Service', () => {
  let service: OAuth2Service;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CqrsModule],
      providers: [
        OAuth2Service,
        {
          provide: BearerTokenService,
          useValue: {}, // provide mock values
        },
        {
          provide: UserService,
          useValue: {}, // provide mock values
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: ClientService,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<OAuth2Service>(OAuth2Service);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
