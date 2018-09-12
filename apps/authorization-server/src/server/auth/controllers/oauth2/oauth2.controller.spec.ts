import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OAuth2Controller } from './oauth2.controller';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { BearerToken } from '../../../models/bearer-token/bearer-token.entity';
import { OAuth2Service } from './oauth2.service';
import { Client } from '../../../models/client/client.entity';
import { ClientService } from '../../../models/client/client.service';

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
          provide: getRepositoryToken(BearerToken),
          useValue: {}, // provide mock values
        },
        {
          provide: getRepositoryToken(Client),
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
