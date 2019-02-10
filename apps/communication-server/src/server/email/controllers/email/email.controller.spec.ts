import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailAccountService } from '../../../email/entities/email-account/email-account.service';
import { EmailAccount } from '../../../email/entities/email-account/email-account.entity';
import { ConfigService } from '../../../config/config.service';
import { AuthServerVerificationGuard } from '../../../auth/guards/authserver-verification.guard';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { TokenGuard } from '../../../auth/guards/token.guard';

describe('EmailController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        EmailService,
        EmailAccountService,
        {
          provide: AuthServerVerificationGuard,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: TokenCacheService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(EmailAccount),
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
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();
  });
  it('should be defined', () => {
    const controller: EmailController = module.get<EmailController>(
      EmailController,
    );
    expect(controller).toBeDefined();
  });
});
