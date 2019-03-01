import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { CommandBus } from '@nestjs/cqrs';

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
        {
          provide: CommandBus,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<ProfileService>(ProfileService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
