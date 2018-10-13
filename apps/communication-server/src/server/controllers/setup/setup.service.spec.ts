import { Test, TestingModule } from '@nestjs/testing';
import { SetupService } from './setup.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerSettings } from '../../models/server-settings/server-settings.entity';
import { ServerSettingsService } from '../../models/server-settings/server-settings.service';
import { HttpService } from '@nestjs/common';
import { from } from 'rxjs';

describe('SetupService', () => {
  let service: SetupService;
  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        SetupService,
        ServerSettingsService,
        {
          provide: getRepositoryToken(ServerSettings),
          useValue: {}, // provide mock values
        },
        {
          provide: HttpService,
          useValue: {
            get() {
              return from([]);
            },
          },
        },
      ],
    }).compile();
    service = testModule.get<SetupService>(SetupService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
