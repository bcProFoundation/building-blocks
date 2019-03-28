import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SocialLoginService } from './social-login.service';
import { SOCIAL_LOGIN } from './social-login.schema';

describe('SocialLoginService', () => {
  let service: SocialLoginService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialLoginService,
        {
          provide: getModelToken(SOCIAL_LOGIN),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<SocialLoginService>(SocialLoginService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
