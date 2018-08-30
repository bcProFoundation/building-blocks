import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../models/user/user.service';
import { OAuth2TokenGeneratorService } from '../../middlewares/oauth2-token-generator.service';
import { AuthorizationCodeService } from '../../../models/authorization-code/authorization-code.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { ClientService } from '../../../models/client/client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { BearerToken } from '../../../models/bearer-token/bearer-token.entity';
import { User } from '../../../models/user/user.entity';
import { Client } from '../../../models/client/client.entity';
import { AuthorizationCode } from '../../../models/authorization-code/authorization-code.entity';
import { IDTokenGrantService } from './id-token-grant.service';

describe('IDTokenGrantService', () => {
  let service: IDTokenGrantService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IDTokenGrantService],
    }).compile();
    service = module.get<IDTokenGrantService>(IDTokenGrantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
