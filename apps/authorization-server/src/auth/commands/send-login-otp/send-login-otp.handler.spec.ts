import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { SendLoginOTPHandler } from './send-login-otp.handler';
import { OTPAggregateService } from '../../aggregates/otp-aggregate/otp-aggregate.service';
import { SendLoginOTPCommand } from './send-login-otp.command';
import { User } from '../../../user-management/entities/user/user.interface';

describe('Command: SendLoginOTPHandler', () => {
  let commandBus$: CommandBus;
  let manager: OTPAggregateService;
  let commandHandler: SendLoginOTPHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        SendLoginOTPHandler,
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: OTPAggregateService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    commandBus$ = module.get<CommandBus>(CommandBus);
    manager = module.get<OTPAggregateService>(OTPAggregateService);
    commandHandler = module.get<SendLoginOTPHandler>(SendLoginOTPHandler);
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should remove sendLoginOTP using the OTPAggregateService', async () => {
    const sendLoginOTP = jest.fn(() => Promise.resolve());
    manager.sendLoginOTP = sendLoginOTP;
    commandBus$.execute = jest.fn(() => Promise.resolve());
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      sendLoginOTP,
    }));
    await commandHandler.execute(
      new SendLoginOTPCommand({ enable2fa: true } as User),
    );
    expect(manager.sendLoginOTP).toHaveBeenCalledTimes(1);
  });
});
