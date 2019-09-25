import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { AddUnverifiedMobileHandler } from './add-unverified-phone.handler';
import { AddUnverifiedMobileCommand } from './add-unverified-phone.command';
import { OTPAggregateService } from '../../aggregates/otp-aggregate/otp-aggregate.service';

describe('Command: AddUnverifiedMobileHandler', () => {
  let commandBus$: CommandBus;
  let manager: OTPAggregateService;
  let commandHandler: AddUnverifiedMobileHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        AddUnverifiedMobileHandler,
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
    commandHandler = module.get<AddUnverifiedMobileHandler>(
      AddUnverifiedMobileHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should add unverified phone using the OTPAggregateService', async () => {
    const addUnverifiedPhone = jest.fn((...args) => Promise.resolve());
    manager.addUnverifiedPhone = addUnverifiedPhone;
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      addUnverifiedPhone,
    }));
    await commandHandler.execute(
      new AddUnverifiedMobileCommand('userUuid', 'unverifiedPhone'),
    );
    expect(manager.addUnverifiedPhone).toHaveBeenCalledTimes(1);
  });
});
