import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../../../config/config.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { UserAuthenticatorService } from '../../../user-management/entities/user-authenticator/user-authenticator.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { AuthService } from '../../controllers/auth/auth.service';
import { WebAuthnAggregateService } from './webauthn-aggregate.service';

describe('WebauthnAggregateService', () => {
  let service: WebAuthnAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebAuthnAggregateService,
        { provide: UserService, useValue: {} },
        { provide: AuthDataService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: UserAuthenticatorService, useValue: {} },
        { provide: ServerSettingsService, useValue: {} },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    service = module.get<WebAuthnAggregateService>(WebAuthnAggregateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
