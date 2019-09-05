import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { SocialLoginManagementService } from '../../aggregates/social-login-management/social-login-management.service';
import { ModifySocialLoginHandler } from './modify-social-login.handler';
import { ModifySocialLoginCommand } from './modify-social-login.command';
import { CreateSocialLoginDto } from '../../controllers/social-login/social-login-create.dto';
import { SocialLogin } from '../../entities/social-login/social-login.interface';

describe('Command: ModifySocialLoginHandler', () => {
  let commandBus$: CommandBus;
  let manager: SocialLoginManagementService;
  let commandHandler: ModifySocialLoginHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        ModifySocialLoginHandler,
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
    commandHandler = module.get<ModifySocialLoginHandler>(
      ModifySocialLoginHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should remove role using the SocialLoginManagementService', async () => {
    const modifySocialLogin = jest.fn(() => Promise.resolve({} as SocialLogin));
    manager.modifySocialLogin = modifySocialLogin;
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      modifySocialLogin,
    }));
    await commandHandler.execute(
      new ModifySocialLoginCommand({} as CreateSocialLoginDto, '420'),
    );
    expect(manager.modifySocialLogin).toHaveBeenCalledTimes(1);
  });
});
