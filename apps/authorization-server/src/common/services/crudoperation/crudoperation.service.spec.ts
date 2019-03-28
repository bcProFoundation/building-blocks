import { Test, TestingModule } from '@nestjs/testing';
import { CRUDOperationService } from './crudoperation.service';

describe('CrudoperationService', () => {
  let service: CRUDOperationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CRUDOperationService],
    }).compile();
    service = module.get<CRUDOperationService>(CRUDOperationService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
