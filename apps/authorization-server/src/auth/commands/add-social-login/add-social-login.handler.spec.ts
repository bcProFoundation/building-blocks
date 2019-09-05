import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { SocialLoginManagementService } from '../../aggregates/social-login-management/social-login-management.service';
import { AddSocialLoginHandler } from './add-social-login.handler';
import { AddSocialLoginCommand } from './add-social-login.command';
import { CreateSocialLoginDto } from '../../controllers/social-login/social-login-create.dto';
import { SocialLogin } from '../../entities/social-login/social-login.interface';

describe('Command: AddSocialLoginHandler', () => {
  let commandBus$: CommandBus;
  let manager: SocialLoginManagementService;
  let commandHandler: AddSocialLoginHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        AddSocialLoginHandler,
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
    commandHandler = module.get<AddSocialLoginHandler>(AddSocialLoginHandler);
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should remove role using the SocialLoginManagementService', async () => {
    const addSocialLogin = jest.fn(() => Promise.resolve({} as SocialLogin));
    manager.addSocialLogin = addSocialLogin;
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      addSocialLogin,
    }));
    await commandHandler.execute(
      new AddSocialLoginCommand({} as CreateSocialLoginDto, '420'),
    );
    expect(manager.addSocialLogin).toHaveBeenCalledTimes(1);
  });
});
