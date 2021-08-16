import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { AGENDA_CONNECTION } from '../../../common/database.provider';
import { UserService } from '../../../user-management/entities/user/user.service';
import { DeleteUnverifiedEmailsService } from './delete-unverified-emails.service';

describe('DeleteUnverifiedEmailsService', () => {
  let service: DeleteUnverifiedEmailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        DeleteUnverifiedEmailsService,
        { provide: UserService, useValue: {} },
        {
          provide: AGENDA_CONNECTION,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DeleteUnverifiedEmailsService>(
      DeleteUnverifiedEmailsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
