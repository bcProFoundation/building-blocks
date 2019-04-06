import { Test, TestingModule } from '@nestjs/testing';
import { EnsureServiceNotAssignedServiceTypePolicyService } from './ensure-service-not-assigned-service-type-policy.service';
import { ServiceService } from '../../entities/service/service.service';

describe('EnsureServiceNotAssignedServiceTypePolicyService', () => {
  let service: EnsureServiceNotAssignedServiceTypePolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnsureServiceNotAssignedServiceTypePolicyService,
        { provide: ServiceService, useValue: {} },
      ],
    }).compile();

    service = module.get<EnsureServiceNotAssignedServiceTypePolicyService>(
      EnsureServiceNotAssignedServiceTypePolicyService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
