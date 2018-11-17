import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2Service } from './oauth2.service';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { getModelToken } from '@nestjs/mongoose';
import { BEARER_TOKEN } from '../../../models/bearer-token/bearer-token.schema';
import { AUTH_DATA } from '../../../models/auth-data/auth-data.schema';
import { UserService } from '../../../models/user/user.service';
import { USER } from '../../../models/user/user.schema';

describe('OAuth2Service', () => {
  let service: OAuth2Service;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2Service,
        BearerTokenService,
        UserService,
        {
          provide: getModelToken(BEARER_TOKEN),
          useValue: {}, // provide mock values
        },
        {
          provide: getModelToken(AUTH_DATA),
          useValue: {}, // provide mock values
        },
        {
          provide: getModelToken(USER),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<OAuth2Service>(OAuth2Service);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
