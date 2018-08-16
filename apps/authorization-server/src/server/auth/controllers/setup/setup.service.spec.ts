import { Test, TestingModule } from '@nestjs/testing';
import { SetupService } from './setup.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScopeService } from '../../../models/scope/scope.service';
import { ClientService } from '../../../models/client/client.service';
import { Client } from '../../../models/client/client.entity';
import { Scope } from '../../../models/scope/scope.entity';
import { UserService } from '../../../models/user/user.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../../../models/user/user.entity';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { AuthDataService } from '../../../models/auth-data/auth-data.service';
import { AuthData } from '../../../models/auth-data/auth-data.entity';

describe('SetupService', () => {
  let service: SetupService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SetupService,
        ClientService,
        ScopeService,
        UserService,
        AuthService,
        CryptographerService,
        AuthDataService,
        {
          provide: getRepositoryToken(Client),
          useValue: {}, // provide mock values
        },
        {
          provide: getRepositoryToken(Scope),
          useValue: {}, // provide mock values
        },
        {
          provide: getRepositoryToken(User),
          useValue: {}, // provide mock values
        },
        {
          provide: getRepositoryToken(AuthData),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<SetupService>(SetupService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
