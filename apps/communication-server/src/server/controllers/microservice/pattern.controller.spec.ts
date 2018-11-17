import { Test, TestingModule } from '@nestjs/testing';
import { MicroservicePatternController } from './pattern.controller';
import { MicroservicePatternService } from './pattern.service';
import { EmailAccountService } from '../../models/email-account/email-account.service';

describe('MicroservicePatternController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [MicroservicePatternController],
      providers: [
        {
          provide: MicroservicePatternService,
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
    const controller: MicroservicePatternController = module.get<
      MicroservicePatternController
    >(MicroservicePatternController);
    expect(controller).toBeDefined();
  });
});
