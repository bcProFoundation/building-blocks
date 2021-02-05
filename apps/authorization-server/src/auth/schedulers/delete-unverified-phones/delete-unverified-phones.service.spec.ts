import { Test, TestingModule } from '@nestjs/testing';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { AGENDA_CONNECTION } from '../../../common/database.provider';
import { UserService } from '../../../user-management/entities/user/user.service';
import { DeleteUnverifiedPhonesService } from './delete-unverified-phones.service';

describe('DeleteUnverifiedPhonesService', () => {
  let service: DeleteUnverifiedPhonesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUnverifiedPhonesService,
        { provide: UserService, useValue: {} },
        { provide: AuthDataService, useValue: {} },
        {
          provide: AGENDA_CONNECTION,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DeleteUnverifiedPhonesService>(
      DeleteUnverifiedPhonesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
