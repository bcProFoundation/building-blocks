import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { from } from 'rxjs';
import { SettingsService } from './settings.service';
import { ServerSettingsService } from '../../entities/server-settings/server-settings.service';

describe('SettingsService', () => {
  let service: SettingsService;
  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: ServerSettingsService,
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
    service = testModule.get<SettingsService>(SettingsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
