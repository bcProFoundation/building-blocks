import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../../../config/config.service';
import { SendEmailService } from './send-email.service';
import { EmailAccountService } from '../../../email/entities/email-account/email-account.service';
import { QueueLogService } from '../../../system-settings/entities/queue-log/queue-log.service';

describe('SendEmailService', () => {
  let service: SendEmailService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SendEmailService,
          useValue: {},
        },
        {
          provide: EmailAccountService,
          useValue: {},
        },
        {
          provide: QueueLogService,
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
    service = module.get<SendEmailService>(SendEmailService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
