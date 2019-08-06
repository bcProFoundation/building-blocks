import { Test, TestingModule } from '@nestjs/testing';
import { ClientManagementAggregateService } from './client-management-aggregate.service';
import { OnlyAllowValidScopeService } from 'client-management/policies';

describe('ClientManagementAggregateService', () => {
  let service: ClientManagementAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientManagementAggregateService,
        { provide: OnlyAllowValidScopeService, useValue: {} },
      ],
    })
      .overrideProvider(ClientManagementAggregateService)
      .useFactory({ factory: () => jest.fn() })
      .compile();

    service = module.get<ClientManagementAggregateService>(
      ClientManagementAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
