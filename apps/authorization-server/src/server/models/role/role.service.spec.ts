import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { Role } from './role.entity';

describe('RoleService', () => {
  let service: RoleService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
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
