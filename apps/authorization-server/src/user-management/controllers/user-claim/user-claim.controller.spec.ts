import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';
import { UserService } from '../../entities/user/user.service';
import { UserClaimController } from './user-claim.controller';

describe('UserClaimController', () => {
  let controller: UserClaimController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [UserClaimController],
      providers: [
        { provide: UserService, useValue: {} },
        { provide: AuthDataService, useValue: {} },
        { provide: ClientService, useValue: {} },
      ],
    }).compile();

    controller = module.get<UserClaimController>(UserClaimController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
