import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OAuth2Controller } from './oauth2.controller';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { BearerToken } from '../../../models/bearer-token/bearer-token.entity';

describe('OAuth2Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [OAuth2Controller],
      providers: [
        {
          provide: 'BearerTokenService',
          useClass: BearerTokenService,
        },
        {
          provide: getRepositoryToken(BearerToken),
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
