import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { UserSessionsDeletedHandler } from './user-sessions-deleted.handler';
import { UserSessionsDeletedEvent } from './user-sessions-deleted.event';
import { SessionService } from '../../../auth/entities/session/session.service';

describe('Event: UserSessionsDeletedHandler', () => {
  let eventBus$: EventBus;
  let eventHandler: UserSessionsDeletedHandler;
  let sessionService: SessionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UserSessionsDeletedHandler,
        { provide: SessionService, useValue: {} },
        {
          provide: EventBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventHandler = module.get<UserSessionsDeletedHandler>(
      UserSessionsDeletedHandler,
    );
    sessionService = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(eventBus$).toBeDefined();
    expect(eventHandler).toBeDefined();
  });

  it('should clear sessions using Mongoose', async () => {
    eventBus$.publish = jest.fn(() => {});
    sessionService.clear = jest.fn(() => Promise.resolve());
    await eventHandler.handle(new UserSessionsDeletedEvent('uuid-here'));
    expect(sessionService.clear).toHaveBeenCalledTimes(1);
  });
});
