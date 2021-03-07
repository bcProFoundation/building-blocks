import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './user.controller';
import { UserService } from '../../../user-management/entities/user/user.service';
import { CryptographerService } from '../../../common/services/cryptographer/cryptographer.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { UserAggregateService } from '../../../user-management/aggregates/user-aggregate/user-aggregate.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';

describe('User Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [UserController],
      providers: [
        {
          provide: CryptographerService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: AuthDataService,
          useValue: {},
        },
        {
          provide: UserAggregateService,
          useValue: {},
        },
        {
          provide: BearerTokenService,
          useValue: {},
        },
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: UserController = module.get<UserController>(
      UserController,
    );
    expect(controller).toBeDefined();
  });
});
