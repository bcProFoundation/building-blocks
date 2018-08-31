import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from 'config/config.service';
import { EmailAccountService } from 'models/email-account/email-account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailAccount } from '../../models/email-account/email-account.entity';

describe('EmailService', () => {
  let service: EmailService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        EmailAccountService,
        {
          provide: ConfigService,
          useValue: {
            get(key) {},
          },
        },
        {
          provide: getRepositoryToken(EmailAccount),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<EmailService>(EmailService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
