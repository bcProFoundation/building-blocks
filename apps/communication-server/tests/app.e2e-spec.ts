import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpService } from '@nestjs/common';
import { from } from 'rxjs';
import { AppService } from '../src/server/app.service';
import { AppController } from '../src/server/app.controller';
import { SetupService } from '../src/server/controllers/setup/setup.service';
import { ServerSettingsService } from '../src/server/models/server-settings/server-settings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerSettings } from '../src/server/models/server-settings/server-settings.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        SetupService,
        ServerSettingsService,
        {
          provide: getRepositoryToken(ServerSettings),
          useValue: {
            find: (...args) => [],
          }, // provide mock values
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

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /info', done => {
    return request(app.getHttpServer())
      .get('/info')
      .expect(200)
      .end(done);
  });
});
