import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2Controller } from './oauth2.controller';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { OAuth2Service } from './oauth2.service';
import { ClientService } from '../../../models/client/client.service';
import { getModelToken } from '@nestjs/mongoose';
import { BEARER_TOKEN } from '../../../models/bearer-token/bearer-token.schema';
import { CLIENT } from '../../../models/client/client.schema';

describe('OAuth2Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [OAuth2Controller],
      providers: [
        OAuth2Service,
        BearerTokenService,
        ClientService,
        {
          provide: getModelToken(BEARER_TOKEN),
          useValue: {}, // provide mock values
        },
        {
          provide: getModelToken(CLIENT),
          useValue: {}, // provide mock values
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
