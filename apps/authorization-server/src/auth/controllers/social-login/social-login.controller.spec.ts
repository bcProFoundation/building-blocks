import { Test, TestingModule } from '@nestjs/testing';
import { SocialLoginController } from './social-login.controller';
import { SocialLoginService } from '../../../auth/entities/social-login/social-login.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { CqrsModule } from '@nestjs/cqrs';

describe('SocialLogin Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CqrsModule],
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
