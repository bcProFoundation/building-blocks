import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { VerifyEmailHandler } from './verify-email.handler';
import { VerifyEmailCommand } from './verify-email.command';
import { UserAggregateService } from '../../../user-management/aggregates/user-aggregate/user-aggregate.service';

describe('Command: VerifyEmailHandler', () => {
  let commandBus$: CommandBus;
  let manager: UserAggregateService;
  let commandHandler: VerifyEmailHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        VerifyEmailHandler,
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: UserAggregateService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    commandBus$ = module.get<CommandBus>(CommandBus);
    manager = module.get<UserAggregateService>(UserAggregateService);
    commandHandler = module.get<VerifyEmailHandler>(VerifyEmailHandler);
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should verify phone/otp using the UserAggregateService', async () => {
    const verifyAndUpdateEmail = jest.fn((...args) => Promise.resolve());
    manager.verifyAndUpdateEmail = verifyAndUpdateEmail;
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      verifyAndUpdateEmail,
    }));
    await commandHandler.execute(new VerifyEmailCommand('verificationCode'));
    expect(manager.verifyAndUpdateEmail).toHaveBeenCalledTimes(1);
  });
});
