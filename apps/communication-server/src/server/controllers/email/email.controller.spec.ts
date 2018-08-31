import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from '../../models/client/client.service';
import { Client } from '../../models/client/client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailAccountService } from '../../models/email-account/email-account.service';
import { EmailAccount } from '../../models/email-account/email-account.entity';
import { ConfigService } from '../../config/config.service';

describe('EmailController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        EmailService,
        ClientService,
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
        {
          provide: getRepositoryToken(Client),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: EmailController = module.get<EmailController>(
      EmailController,
    );
    expect(controller).toBeDefined();
  });
});
