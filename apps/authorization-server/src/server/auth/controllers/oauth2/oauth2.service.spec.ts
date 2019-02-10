import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2Service } from './oauth2.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';

describe('OAuth2Service', () => {
  let service: OAuth2Service;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();
    service = module.get<OAuth2Service>(OAuth2Service);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
