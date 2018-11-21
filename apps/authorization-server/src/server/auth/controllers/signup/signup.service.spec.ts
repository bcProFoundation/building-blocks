import { Test, TestingModule } from '@nestjs/testing';
import { SignupService } from './signup.service';
import { HttpService } from '@nestjs/common';
import { UserService } from '../../../models/user/user.service';
import { ServerSettingsService } from '../../../models/server-settings/server-settings.service';
import { ClientService } from '../../../models/client/client.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { AuthDataService } from '../../../models/auth-data/auth-data.service';

describe('SignupService', () => {
  let service: SignupService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignupService,
        { provide: HttpService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: ServerSettingsService, useValue: {} },
        { provide: ClientService, useValue: {} },
        { provide: CryptographerService, useValue: {} },
        { provide: AuthDataService, useValue: {} },
      ],
    }).compile();
    service = module.get<SignupService>(SignupService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
