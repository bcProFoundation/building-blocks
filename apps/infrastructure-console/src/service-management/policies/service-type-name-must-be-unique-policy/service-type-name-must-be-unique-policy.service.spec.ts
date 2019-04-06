import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTypeNameMustBeUniquePolicyService } from './service-type-name-must-be-unique-policy.service';
import { ServiceTypeService } from '../../entities/service-type/service-type.service';

describe('ServiceTypeNameMustBeUniquePolicyService', () => {
  let service: ServiceTypeNameMustBeUniquePolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceTypeNameMustBeUniquePolicyService,
        { provide: ServiceTypeService, useValue: {} },
      ],
    }).compile();

    service = module.get<ServiceTypeNameMustBeUniquePolicyService>(
      ServiceTypeNameMustBeUniquePolicyService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
