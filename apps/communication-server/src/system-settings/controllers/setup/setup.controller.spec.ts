import { Test, TestingModule } from '@nestjs/testing';
import { SetupController } from './setup.controller';
import { SetupService } from '../../aggregates/setup/setup.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import { HttpService } from '@nestjs/axios';
import { from } from 'rxjs';

describe('SetupController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SetupController],
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
  });
  it('should be defined', () => {
    const controller: SetupController =
      module.get<SetupController>(SetupController);
    expect(controller).toBeDefined();
  });
});
