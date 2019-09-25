import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { VerifyPhoneHandler } from './verify-phone.handler';
import { VerifyPhoneCommand } from './verify-phone.command';
import { OTPAggregateService } from '../../aggregates/otp-aggregate/otp-aggregate.service';

describe('Command: VerifyPhoneHandler', () => {
  let commandBus$: CommandBus;
  let manager: OTPAggregateService;
  let commandHandler: VerifyPhoneHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        VerifyPhoneHandler,
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
    commandHandler = module.get<VerifyPhoneHandler>(VerifyPhoneHandler);
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should verify phone/otp using the OTPAggregateService', async () => {
    const verifyPhone = jest.fn((...args) => Promise.resolve());
    manager.verifyPhone = verifyPhone;
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      verifyPhone,
    }));
    await commandHandler.execute(new VerifyPhoneCommand('userUuid', 'otp'));
    expect(manager.verifyPhone).toHaveBeenCalledTimes(1);
  });
});
