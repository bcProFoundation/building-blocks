import { Test, TestingModule } from '@nestjs/testing';
import { SocialLoginController } from './social-login.controller';
import { SocialLoginService } from '../../../models/social-login/social-login.service';
import { UserService } from '../../../models/user/user.service';
import { CRUDOperationService } from '../common/crudoperation/crudoperation.service';

describe('SocialLogin Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SocialLoginController],
      providers: [
        {
          provide: SocialLoginService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: CRUDOperationService,
          useValue: {},
        },
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SocialLoginController = module.get<SocialLoginController>(
      SocialLoginController,
    );
    expect(controller).toBeDefined();
  });
});
