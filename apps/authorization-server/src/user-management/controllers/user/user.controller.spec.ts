import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../../user-management/entities/user/user.service';
import { CryptographerService } from '../../../common/cryptographer.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { CRUDOperationService } from '../../../common/services/crudoperation/crudoperation.service';
import { UserAggregateService } from '../../../user-management/aggregates/user-aggregate/user-aggregate.service';
import { CqrsModule } from '@nestjs/cqrs';

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
          provide: CRUDOperationService,
          useValue: {},
        },
        {
          provide: UserAggregateService,
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
