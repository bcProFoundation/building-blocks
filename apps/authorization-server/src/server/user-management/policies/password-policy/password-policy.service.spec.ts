import { Test, TestingModule } from '@nestjs/testing';
import { PasswordPolicyService } from './password-policy.service';

describe('PasswordPolicyService', () => {
  let service: PasswordPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordPolicyService],
    }).compile();

    service = module.get<PasswordPolicyService>(PasswordPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
