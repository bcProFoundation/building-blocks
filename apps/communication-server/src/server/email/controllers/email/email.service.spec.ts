import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { EmailAccountService } from '../../../email/entities/email-account/email-account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailAccount } from '../../../email/entities/email-account/email-account.entity';
import { ConfigService } from '../../../config/config.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

describe('EmailService', () => {
  let service: EmailService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        EmailAccountService,
        {
          provide: getRepositoryToken(EmailAccount),
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get(env) {
              switch (env) {
                case 'AMQP_HOST':
                  return 'localhost';
              }
            },
            getRabbitMQConfig() {
              return '';
            },
          },
        },
      ],
    }).compile();
    service = module.get<EmailService>(EmailService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
