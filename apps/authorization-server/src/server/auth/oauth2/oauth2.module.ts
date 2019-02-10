import { Module } from '@nestjs/common';
import { OAuth2TokenGeneratorService } from './oauth2-token-generator/oauth2-token-generator.service';
import { CodeGrantService } from './code-grant/code-grant.service';
import { TokenGrantService } from './token-grant/token-grant.service';
import { CodeExchangeService } from './code-exchange/code-exchange.service';
import { PasswordExchangeService } from './password-exchange/password-exchange.service';
import { ClientCredentialExchangeService } from './client-credential-exchange/client-credential-exchange.service';
import { RefreshTokenExchangeService } from './refresh-token-exchange/refresh-token-exchange.service';
import { IDTokenGrantService } from './id-token-grant/id-token-grant.service';
import { OIDCKeyService } from '../entities/oidc-key/oidc-key.service';

@Module({
  providers: [
    OAuth2TokenGeneratorService,
    CodeGrantService,
    TokenGrantService,
    CodeExchangeService,
    PasswordExchangeService,
    ClientCredentialExchangeService,
    RefreshTokenExchangeService,
    IDTokenGrantService,
    OIDCKeyService,
  ],
  exports: [
    OAuth2TokenGeneratorService,
    CodeGrantService,
    TokenGrantService,
    CodeExchangeService,
    PasswordExchangeService,
    ClientCredentialExchangeService,
    RefreshTokenExchangeService,
    IDTokenGrantService,
    OIDCKeyService,
  ],
})
export class OAuth2Module {}
