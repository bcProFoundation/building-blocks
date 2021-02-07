import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { AddUnverifiedEmailHandler } from './add-unverified-phone.handler';
import { AddUnverifiedEmailCommand } from './add-unverified-phone.command';
import { UserAggregateService } from '../../../user-management/aggregates/user-aggregate/user-aggregate.service';

describe('Command: AddUnverifiedEmailHandler', () => {
  let commandBus$: CommandBus;
  let manager: UserAggregateService;
  let commandHandler: AddUnverifiedEmailHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        AddUnverifiedEmailHandler,
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
    commandHandler = module.get<AddUnverifiedEmailHandler>(
      AddUnverifiedEmailHandler,
    );
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should add verified email using the UserAggregateService', async () => {
    const addUnverifiedEmail = jest.fn((...args) => Promise.resolve());
    manager.addUnverifiedEmail = addUnverifiedEmail;
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      addUnverifiedEmail,
    }));
    await commandHandler.execute(
      new AddUnverifiedEmailCommand('userUuid', 'unverifiedEmail'),
    );
    expect(manager.addUnverifiedEmail).toHaveBeenCalledTimes(1);
  });
});
