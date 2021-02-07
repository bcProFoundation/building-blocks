import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { EmailVerificationCodeHandler } from './email-verification-code.handler';
import { EmailVerificationCodeCommand } from './email-verification-code.command';
import { SignupService } from '../../aggregates/signup/signup.service';

describe('Command: EmailVerificationCodeHandler', () => {
  let commandBus$: CommandBus;
  let manager: SignupService;
  let commandHandler: EmailVerificationCodeHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        EmailVerificationCodeHandler,
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: SignupService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    commandBus$ = module.get<CommandBus>(CommandBus);
    manager = module.get<SignupService>(SignupService);
    commandHandler = module.get<EmailVerificationCodeHandler>(
      EmailVerificationCodeHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should sendUnverifiedEmailVerificationCode using the SignupService', async () => {
    const sendUnverifiedEmailVerificationCode = jest.fn(() =>
      Promise.resolve(),
    );
    manager.sendUnverifiedEmailVerificationCode = sendUnverifiedEmailVerificationCode;
    commandBus$.execute = jest.fn(() => Promise.resolve());
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      sendUnverifiedEmailVerificationCode,
    }));
    await commandHandler.execute(new EmailVerificationCodeCommand('userUuid'));
    expect(manager.sendUnverifiedEmailVerificationCode).toHaveBeenCalledTimes(
      1,
    );
  });
});
