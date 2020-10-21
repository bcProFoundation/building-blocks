import { Test, TestingModule } from '@nestjs/testing';
import { UserClaimService } from './user-claim.service';
import { USER_CLAIM } from './user-claim.schema';

describe('UserClaimService', () => {
  let service: UserClaimService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserClaimService,
        {
          provide: USER_CLAIM,
          useValue: {}, // use mock values
        },
      ],
    }).compile();
    service = module.get<UserClaimService>(UserClaimService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
