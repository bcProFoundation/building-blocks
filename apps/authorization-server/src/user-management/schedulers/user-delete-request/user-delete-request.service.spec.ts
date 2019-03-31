import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import { UserDeleteRequestService } from './user-delete-request.service';
import { ClientService } from '../../../client-management/entities/client/client.service';

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
          provide: ConfigService,
          useValue: {
            get(...args) {},
          },
        },
      ],
    }).compile();
    service = module.get<UserDeleteRequestService>(UserDeleteRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
