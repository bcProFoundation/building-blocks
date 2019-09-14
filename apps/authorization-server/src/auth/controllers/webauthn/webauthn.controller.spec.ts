import { Test, TestingModule } from '@nestjs/testing';
import { WebAuthnController } from './webauthn.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

describe('WebAuthn Controller', () => {
  let controller: WebAuthnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebAuthnController],
      providers: [
        { provide: CommandBus, useFactory: () => jest.fn() },
        { provide: QueryBus, useFactory: () => jest.fn() },
      ],
    }).compile();

    controller = module.get<WebAuthnController>(WebAuthnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
