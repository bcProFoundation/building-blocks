import { Test, TestingModule } from '@nestjs/testing';
import { ServiceClientIdMustExistPolicyService } from './service-client-id-must-exist-policy.service';
import { ServiceService } from '../../entities/service/service.service';

describe('ServiceClientIdmustExistPolicyService', () => {
  let service: ServiceClientIdMustExistPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceClientIdMustExistPolicyService,
        { provide: ServiceService, useValue: {} },
      ],
    }).compile();

    service = module.get<ServiceClientIdMustExistPolicyService>(
      ServiceClientIdMustExistPolicyService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
