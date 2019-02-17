import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { AuthServerVerificationGuard } from '../../../auth/guards/authserver-verification.guard';
import { EmailAccountService } from '../../../email/entities/email-account/email-account.service';

describe('EmailController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useFactory: (...args) => jest.fn(),
        },
        {
          provide: EmailAccountService,
          useFactory: (...args) => jest.fn(),
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .overrideGuard(AuthServerVerificationGuard)
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
