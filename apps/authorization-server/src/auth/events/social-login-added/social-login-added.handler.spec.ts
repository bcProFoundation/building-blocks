import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { SocialLoginAddedHandler } from './social-login-added.handler';
import { SocialLoginService } from '../../entities/social-login/social-login.service';
import { SocialLoginAddedEvent } from './social-login-added.event';
import { SocialLogin } from '../../entities/social-login/social-login.interface';

describe('Event: SocialLoginAddedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: SocialLoginAddedHandler;

  let socialLogin: SocialLoginService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        SocialLoginAddedHandler,
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
    eventHandler = module.get<SocialLoginAddedHandler>(SocialLoginAddedHandler);
    socialLogin = module.get<SocialLoginService>(SocialLoginService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should add Client using SocialLoginService', async () => {
    socialLogin.save = jest.fn((...args) =>
      Promise.resolve({} as SocialLogin & { _id: any }),
    );
    eventBus$.publish = jest.fn(() => {});
    await eventHandler.handle(new SocialLoginAddedEvent({} as SocialLogin));
    expect(socialLogin.save).toHaveBeenCalledTimes(1);
  });
});
