import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { SocialLoginRemovedHandler } from './social-login-removed.handler';
import { SocialLoginRemovedEvent } from './social-login-removed.event';
import { SocialLogin } from '../../entities/social-login/social-login.interface';
import { SocialLoginService } from '../../entities/social-login/social-login.service';

describe('Event: SocialLoginRemovedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: SocialLoginRemovedHandler;
  let socialLogin: SocialLoginService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        SocialLoginRemovedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: SocialLoginService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<SocialLoginRemovedHandler>(
      SocialLoginRemovedHandler,
    );
    socialLogin = module.get<SocialLoginService>(SocialLoginService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should remove SocialLogin using SocialLoginService', async () => {
    const mockSocialLogin = {} as SocialLogin;
    socialLogin.remove = jest.fn(() => Promise.resolve(mockSocialLogin));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(
      new SocialLoginRemovedEvent(
        '9ac0d438-c9c4-4166-a896-3b0902f8bd99',
        mockSocialLogin,
      ),
    );
    expect(socialLogin.remove).toHaveBeenCalledTimes(1);
  });
});
