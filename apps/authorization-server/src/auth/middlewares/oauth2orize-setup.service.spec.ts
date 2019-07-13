import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2orizeSetup } from './oauth2orize.setup';
import { ClientService } from '../../client-management/entities/client/client.service';
import { BearerTokenService } from '../entities/bearer-token/bearer-token.service';
import { CodeGrantService } from '../oauth2/code-grant/code-grant.service';
import { TokenGrantService } from '../oauth2/token-grant/token-grant.service';
import { CodeExchangeService } from '../oauth2/code-exchange/code-exchange.service';
import { PasswordExchangeService } from '../oauth2/password-exchange/password-exchange.service';
import { ClientCredentialExchangeService } from '../oauth2/client-credential-exchange/client-credential-exchange.service';
import { RefreshTokenExchangeService } from '../oauth2/refresh-token-exchange/refresh-token-exchange.service';
import { IDTokenGrantService } from '../oauth2/id-token-grant/id-token-grant.service';

describe('OAuth2orizeSetup', () => {
  let service: OAuth2orizeSetup;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2orizeSetup,
        { provide: ClientService, useValue: {} },
        { provide: BearerTokenService, useValue: {} },
        { provide: CodeGrantService, useValue: {} },
        { provide: TokenGrantService, useValue: {} },
        { provide: CodeExchangeService, useValue: {} },
        { provide: PasswordExchangeService, useValue: {} },
        { provide: ClientCredentialExchangeService, useValue: {} },
        { provide: RefreshTokenExchangeService, useValue: {} },
        { provide: IDTokenGrantService, useValue: {} },
      ],
    }).compile();
    service = module.get<OAuth2orizeSetup>(OAuth2orizeSetup);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
