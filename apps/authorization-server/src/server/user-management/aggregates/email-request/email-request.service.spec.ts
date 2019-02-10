import { Test, TestingModule } from '@nestjs/testing';
import { EmailRequestService } from './email-request.service';
import { HttpService } from '@nestjs/common';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientService } from '../../../client-management/entities/client/client.service';

describe('EmailRequestService', () => {
  let service: EmailRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailRequestService,
        {
          provide: HttpService,
          useFactory: () => jest.fn(),
        },
        {
          provide: ServerSettingsService,
          useFactory: () => jest.fn(),
        },
        {
          provide: ClientService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    service = module.get<EmailRequestService>(EmailRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
