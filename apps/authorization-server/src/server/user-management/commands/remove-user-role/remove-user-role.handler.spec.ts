import { Test } from '@nestjs/testing';
import { CommandBus, CQRSModule, EventPublisher } from '@nestjs/cqrs';
import { UserManagementService } from '../../../user-management/aggregates/user-management/user-management.service';
import { RemoveUserRoleHandler } from './remove-user-role.handler';
import { Role } from '../../../user-management/entities/role/role.interface';
import { RemoveUserRoleCommand } from './remove-user-role.command';

describe('Command: RemoveUserRoleHandler', () => {
  let commandBus$: CommandBus;
  let manager: UserManagementService;
  let commandHandler: RemoveUserRoleHandler;
  let publisher: EventPublisher;

  const mockRole = {
    name: 'test-role',
    uuid: 'e2dfbffb-df50-406d-bb80-a554a9afedec',
  } as Role;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CQRSModule],
      providers: [
        RemoveUserRoleHandler,
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
        {
          provide: UserManagementService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    commandBus$ = module.get<CommandBus>(CommandBus);
    manager = module.get<UserManagementService>(UserManagementService);
    commandHandler = module.get<RemoveUserRoleHandler>(RemoveUserRoleHandler);
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(commandBus$).toBeDefined();
    expect(manager).toBeDefined();
    expect(commandHandler).toBeDefined();
  });

  it('should remove role using the UserManagementService', async () => {
    manager.deleteRole = jest.fn(() => Promise.resolve());
    commandBus$.execute = jest.fn(() => {});
    publisher.mergeObjectContext = jest.fn(aggregate => ({
      commit: () => {},
    }));
    await commandHandler.execute(
      new RemoveUserRoleCommand(
        'e2dfbffb-df50-406d-bb80-a554a9afedec',
        mockRole.name,
      ),
      (...args) => {},
    );
    expect(manager.deleteRole).toHaveBeenCalledTimes(1);
  });
});
