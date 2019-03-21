import { Test, TestingModule } from '@nestjs/testing';
import { RoleValidationPolicyService } from './role-validation-policy.service';
import { RoleService } from '../../entities/role/role.service';

describe('RoleValidationPolicyService', () => {
  let service: RoleValidationPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleValidationPolicyService,
        { provide: RoleService, useValue: {} },
      ],
    }).compile();

    service = module.get<RoleValidationPolicyService>(
      RoleValidationPolicyService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
