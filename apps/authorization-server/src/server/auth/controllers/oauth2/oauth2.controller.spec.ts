import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2Controller } from './oauth2.controller';
import { OAuth2Service } from './oauth2.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { UserService } from '../../../user-management/entities/user/user.service';

describe('OAuth2Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [OAuth2Controller],
      providers: [
        OAuth2Service,
        {
          provide: BearerTokenService,
          useValue: {},
        },
        {
          provide: ClientService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: OAuth2Controller = module.get<OAuth2Controller>(
      OAuth2Controller,
    );
    expect(controller).toBeDefined();
  });
});
