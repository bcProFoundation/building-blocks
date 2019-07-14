import { Test } from '@nestjs/testing';
import { CommandBus, CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { UpdateBrandInfoHandler } from './update-brand-info.handler';
import { BrandAggregateService } from '../../aggregates/brand-aggregate/brand-aggregate.service';
import { UpdateBrandInfoCommand } from './update-brand-info.command';
import { UpdateBrandInfoDto } from '../../policies/update-brand-info/update-brand-info.dto';

describe('Command: UpdateBrandInfoHandler', () => {
  let commandBus$: CommandBus;
  let manager: BrandAggregateService;
  let commandHandler: UpdateBrandInfoHandler;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UpdateBrandInfoHandler,
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: BrandAggregateService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    commandBus$ = module.get<CommandBus>(CommandBus);
    manager = module.get<BrandAggregateService>(BrandAggregateService);
    commandHandler = module.get<UpdateBrandInfoHandler>(UpdateBrandInfoHandler);
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should update brandInfo using the BrandAggregateService', async () => {
    manager.updateBrandInfo = jest.fn(() => Promise.resolve());
    commandBus$.execute = jest.fn();
    publisher.mergeObjectContext = jest.fn().mockImplementation((...args) => ({
      commit: () => {},
      updateBrandInfo: manager.updateBrandInfo,
    }));

    const brandInfo = new UpdateBrandInfoDto();
    await commandHandler.execute(new UpdateBrandInfoCommand({}, brandInfo));
    expect(manager.updateBrandInfo).toHaveBeenCalledTimes(1);
  });
});
