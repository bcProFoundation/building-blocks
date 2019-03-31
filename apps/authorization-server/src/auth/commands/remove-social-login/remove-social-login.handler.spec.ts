import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { SocialLoginManagementService } from '../../../auth/aggregates/social-login-management/social-login-management.service';
import { RemoveSocialLoginHandler } from './remove-social-login.handler';
import { RemoveSocialLoginCommand } from './remove-social-login.command';
import { SocialLogin } from '../../../auth/entities/social-login/social-login.interface';

describe('Command: RemoveSocialLoginHandler', () => {
  let commandBus$: CommandBus;
  let manager: SocialLoginManagementService;
  let commandHandler: RemoveSocialLoginHandler;
  let publisher: EventPublisher;

  const mockSocialLogin = {
    scope: [],
    clientSecretToTokenEndpoint: false,
    name: 'Test Social Login',
    createdBy: '62843fea-1e30-4b1f-af91-3ff582ff9948',
    creation: new Date(),
    uuid: 'f97cef1e-4b15-4194-b40d-7ea0c0d8fa24',
  } as SocialLogin;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        RemoveSocialLoginHandler,
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: SocialLoginManagementService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    commandBus$ = module.get<CommandBus>(CommandBus);
    manager = module.get<SocialLoginManagementService>(
      SocialLoginManagementService,
    );
    commandHandler = module.get<RemoveSocialLoginHandler>(
      RemoveSocialLoginHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should remove SocialLogin using the SocialLoginManagementService', async () => {
    manager.removeSocialLogin = jest.fn(() => Promise.resolve());
    commandBus$.execute = jest.fn(() => Promise.resolve());
    publisher.mergeObjectContext = jest
      .fn()
      .mockImplementation((...args) => ({ commit: () => {} }));
    await commandHandler.execute(
      new RemoveSocialLoginCommand(
        mockSocialLogin.createdBy,
        mockSocialLogin.uuid,
      ),
    );
    expect(manager.removeSocialLogin).toHaveBeenCalledTimes(1);
  });
});
