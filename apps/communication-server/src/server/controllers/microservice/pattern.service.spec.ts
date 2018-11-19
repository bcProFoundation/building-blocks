import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../../config/config.service';
import { MicroservicePatternService } from './pattern.service';
import { EmailAccountService } from '../../models/email-account/email-account.service';

describe('MicroservicePatternService', () => {
  let service: MicroservicePatternService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MicroservicePatternService,
          useValue: {},
        },
        {
          provide: EmailAccountService,
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
    service = module.get<MicroservicePatternService>(
      MicroservicePatternService,
    );
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
