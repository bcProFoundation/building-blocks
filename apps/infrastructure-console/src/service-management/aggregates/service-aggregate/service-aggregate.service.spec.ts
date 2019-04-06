import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAggregateService } from './service-aggregate.service';
import {
  ServiceClientIdMustBeUniquePolicyService,
  ServiceTypeNameMustBeUniquePolicyService,
  ServiceClientIdMustExistPolicyService,
  ServiceTypeNameMustExistPolicyService,
  ClientIdMustExistOnAuthorizationServerPolicyService,
  EnsureServiceNotAssignedServiceTypePolicyService,
} from '../../policies';

describe('ServiceAggregateService', () => {
  let service: ServiceAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceAggregateService,
        { provide: ServiceClientIdMustBeUniquePolicyService, useValue: {} },
        { provide: ServiceTypeNameMustBeUniquePolicyService, useValue: {} },
        { provide: ServiceClientIdMustExistPolicyService, useValue: {} },
        { provide: ServiceTypeNameMustExistPolicyService, useValue: {} },
        {
          provide: ClientIdMustExistOnAuthorizationServerPolicyService,
          useValue: {},
        },
        {
          provide: EnsureServiceNotAssignedServiceTypePolicyService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ServiceAggregateService>(ServiceAggregateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
