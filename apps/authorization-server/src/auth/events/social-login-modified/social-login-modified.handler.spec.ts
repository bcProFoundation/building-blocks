import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { SocialLoginModifiedHandler } from './social-login-modified.handler';
import { SocialLoginService } from '../../entities/social-login/social-login.service';
import { SocialLoginModifiedEvent } from './social-login-modified.event';
import { SocialLogin } from '../../entities/social-login/social-login.interface';

describe('Event: SocialLoginModifiedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: SocialLoginModifiedHandler;

  let socialLogin: SocialLoginService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        SocialLoginModifiedHandler,
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: SocialLoginService,
          useValue: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<SocialLoginModifiedHandler>(
      SocialLoginModifiedHandler,
    );
    socialLogin = module.get<SocialLoginService>(SocialLoginService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should add Client using SocialLoginService', async () => {
    socialLogin.save = jest.fn((...args) => Promise.resolve({} as SocialLogin));
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new SocialLoginModifiedEvent({} as SocialLogin));
    expect(socialLogin.save).toHaveBeenCalledTimes(1);
  });
});
