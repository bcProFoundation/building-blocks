import { TestingModule, Test } from '@nestjs/testing';
import { OAuth2orizeSetup } from './oauth2orize.setup';
import { OAuth2TokenMiddleware } from './oauth2-token.middleware';

describe('OAuth2TokenMiddleware', () => {
  let middleware: OAuth2TokenMiddleware;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2TokenMiddleware,
        {
          provide: OAuth2orizeSetup,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    middleware = module.get<OAuth2TokenMiddleware>(OAuth2TokenMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
