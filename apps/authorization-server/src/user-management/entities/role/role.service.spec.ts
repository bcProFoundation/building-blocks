import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { getModelToken } from '@nestjs/mongoose';
import { ROLE } from './role.schema';

describe('RoleService', () => {
  let service: RoleService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getModelToken(ROLE),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<RoleService>(RoleService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
