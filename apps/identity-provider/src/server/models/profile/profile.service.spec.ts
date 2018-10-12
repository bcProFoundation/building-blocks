import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from './profile.entity';

describe('ProfileService', () => {
  let service: ProfileService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(Profile),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<ProfileService>(ProfileService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
