import { Test, TestingModule } from '@nestjs/testing';
import { UserManagementService } from './user-management.service';
import { UserService } from './user.service';
import { AuthDataService } from '../auth-data/auth-data.service';
import { ClientService } from '../client/client.service';
import { UserDeleteRequestService } from '../../scheduler/user-delete-request.service';
import { BearerTokenService } from '../bearer-token/bearer-token.service';

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
          provide: UserDeleteRequestService,
          useValue: {},
        },
        {
          provide: BearerTokenService,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<UserManagementService>(UserManagementService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
