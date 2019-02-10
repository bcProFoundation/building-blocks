import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../user-management/entities/user/user.service';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import { AuthorizationCodeService } from '../../../auth/entities/authorization-code/authorization-code.service';
import { CryptographerService } from '../../../common/cryptographer.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { CodeGrantService } from './code-grant.service';

describe('CodeGrantService', () => {
  let service: CodeGrantService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeGrantService,
        { provide: UserService, useValue: {} },
        { provide: ClientService, useValue: {} },
        { provide: OAuth2TokenGeneratorService, useValue: {} },
        { provide: AuthorizationCodeService, useValue: {} },
        { provide: CryptographerService, useValue: {} },
      ],
    }).compile();
    service = module.get<CodeGrantService>(CodeGrantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
