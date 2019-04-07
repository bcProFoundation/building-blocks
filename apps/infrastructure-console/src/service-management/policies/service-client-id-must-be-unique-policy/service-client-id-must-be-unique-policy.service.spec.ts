import { Test, TestingModule } from '@nestjs/testing';
import { ServiceClientIdMustBeUniquePolicyService } from './service-client-id-must-be-unique-policy.service';
import { ServiceService } from '../../entities/service/service.service';

describe('ServiceClientIdmustBeUniquePolicyService', () => {
  let service: ServiceClientIdMustBeUniquePolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceClientIdMustBeUniquePolicyService,
        { provide: ServiceService, useValue: {} },
      ],
    }).compile();

    service = module.get<ServiceClientIdMustBeUniquePolicyService>(
      ServiceClientIdMustBeUniquePolicyService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
