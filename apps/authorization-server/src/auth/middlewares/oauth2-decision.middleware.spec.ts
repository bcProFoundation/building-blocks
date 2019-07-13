import { TestingModule, Test } from '@nestjs/testing';
import { OAuth2orizeSetup } from './oauth2orize.setup';
import { OAuth2DecisionMiddleware } from './oauth2-decision.middleware';

describe('OAuth2DecisionMiddleware', () => {
  let middleware: OAuth2DecisionMiddleware;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2DecisionMiddleware,
        {
          provide: OAuth2orizeSetup,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    middleware = module.get<OAuth2DecisionMiddleware>(OAuth2DecisionMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
