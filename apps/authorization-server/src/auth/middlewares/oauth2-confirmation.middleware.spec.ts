import { TestingModule, Test } from '@nestjs/testing';
import { OAuth2orizeSetup } from './oauth2orize.setup';
import { OAuth2ConfirmationMiddleware } from './oauth2-confirmation.middleware';

describe('OAuth2ConfirmationMiddleware', () => {
  let middleware: OAuth2ConfirmationMiddleware;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2ConfirmationMiddleware,
        {
          provide: OAuth2orizeSetup,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    middleware = module.get<OAuth2ConfirmationMiddleware>(
      OAuth2ConfirmationMiddleware,
    );
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
