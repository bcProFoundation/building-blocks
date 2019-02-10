import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailController } from './send-email.controller';
import { SendEmailService } from './send-email.service';
import { EmailAccountService } from '../../../email/entities/email-account/email-account.service';

describe('SendEmailController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SendEmailController],
      providers: [
        {
          provide: SendEmailService,
          useValue: {},
        },
        {
          provide: EmailAccountService,
          useValue: {},
        },
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SendEmailController = module.get<SendEmailController>(
      SendEmailController,
    );
    expect(controller).toBeDefined();
  });
});
