import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { EmailService } from './email.service';
import { EmailAccountService } from '../../../email/entities/email-account/email-account.service';

describe('EmailService', () => {
  let service: EmailService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: EmailAccountService,
          useValue: {},
        },
        {
          provide: CommandBus,
          useFactory: (...args) => jest.fn(),
        },
      ],
    }).compile();
    service = module.get<EmailService>(EmailService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
