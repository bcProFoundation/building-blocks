import { Test, TestingModule } from '@nestjs/testing';
import { SignupService } from './signup.service';
import { HttpService } from '@nestjs/common';
import { UserService } from '../../entities/user/user.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { CryptographerService } from '../../../common/services/cryptographer/cryptographer.service';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';

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
