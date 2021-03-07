import { Test, TestingModule } from '@nestjs/testing';
import { WebAuthnController } from './webauthn.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';

describe('WebAuthn Controller', () => {
  let controller: WebAuthnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebAuthnController],
      providers: [
        { provide: CommandBus, useFactory: () => jest.fn() },
        { provide: QueryBus, useFactory: () => jest.fn() },
        { provide: BearerTokenService, useValue: {} },
      ],
    }).compile();

    controller = module.get<WebAuthnController>(WebAuthnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
