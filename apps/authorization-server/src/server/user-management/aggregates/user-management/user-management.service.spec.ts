import { Test, TestingModule } from '@nestjs/testing';
import { UserManagementService } from './user-management.service';
import { UserService } from '../../entities/user/user.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';

describe('UserManagementService', () => {
  let service: UserManagementService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserManagementService,
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: AuthDataService,
          useValue: {},
        },
        {
          provide: ClientService,
          useValue: {},
        },
        {
          provide: BearerTokenService,
          useValue: {},
        },
      ],
    })
      .overrideProvider(UserManagementService)
      .useFactory({ factory: () => jest.fn() })
      .compile();
    service = module.get<UserManagementService>(UserManagementService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
