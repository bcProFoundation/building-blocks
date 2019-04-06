import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTypeNameMustExistPolicyService } from './service-type-name-must-exist-policy.service';
import { ServiceTypeService } from '../../entities/service-type/service-type.service';

describe('ServiceTypeNameMustExistPolicyService', () => {
  let service: ServiceTypeNameMustExistPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceTypeNameMustExistPolicyService,
        { provide: ServiceTypeService, useValue: {} },
      ],
    }).compile();

    service = module.get<ServiceTypeNameMustExistPolicyService>(
      ServiceTypeNameMustExistPolicyService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
