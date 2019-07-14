import { TestingModule, Test } from '@nestjs/testing';
import { OAuth2AuthorizationMiddleware } from './oauth2-authorization.middleware';
import { OAuth2orizeSetup } from './oauth2orize.setup';

describe('OAuth2AuthorizationMiddleware', () => {
  let middleware: OAuth2AuthorizationMiddleware;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2AuthorizationMiddleware,
        {
          provide: OAuth2orizeSetup,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    middleware = module.get<OAuth2AuthorizationMiddleware>(
      OAuth2AuthorizationMiddleware,
    );
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
