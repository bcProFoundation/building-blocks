import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientService } from './models/client/client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from './models/client/client.entity';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: {}, // mock
        },
      ],
    }).compile();
  });

  describe('root', () => {
    it('should return "{ "message": "NestJS" }"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.message()).toEqual({ message: 'NestJS' });
    });
  });
});
