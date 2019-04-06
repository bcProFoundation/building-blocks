import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTypeService } from './service-type.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServiceType } from './service-type.entity';

describe('ServiceTypeService', () => {
  let service: ServiceTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceTypeService,
        { provide: getRepositoryToken(ServiceType), useValue: {} },
      ],
    }).compile();

    service = module.get<ServiceTypeService>(ServiceTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
