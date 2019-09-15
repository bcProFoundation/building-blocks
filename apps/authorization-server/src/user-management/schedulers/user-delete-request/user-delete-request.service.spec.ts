import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { UserDeleteRequestService } from './user-delete-request.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { AGENDA_CONNECTION } from '../../../common/database.provider';

describe('UserDeleteRequestService', () => {
  let service: UserDeleteRequestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDeleteRequestService,
        {
          provide: ClientService,
          useValue: {}, // mock
        },
        {
          provide: HttpService,
          useValue: {}, // mock
        },
        {
          provide: AGENDA_CONNECTION,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<UserDeleteRequestService>(UserDeleteRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
