import { Test, TestingModule } from '@nestjs/testing';
import { UserClaimService } from '../../../auth/entities/user-claim/user-claim.service';
import { UserService } from '../../entities/user/user.service';
import { UserClaimAggregateService } from './user-claim-aggregate.service';

describe('UserClaimAggregateService', () => {
  let service: UserClaimAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserClaimAggregateService,
        { provide: UserService, useValue: {} },
        { provide: UserClaimService, useValue: {} },
      ],
    }).compile();

    service = module.get<UserClaimAggregateService>(UserClaimAggregateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
