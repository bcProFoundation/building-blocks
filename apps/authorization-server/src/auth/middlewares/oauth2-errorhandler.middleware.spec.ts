import { TestingModule, Test } from '@nestjs/testing';
import { OAuth2orizeSetup } from './oauth2orize.setup';
import { OAuth2ErrorHandlerMiddleware } from './oauth2-errorhandler.middleware';

describe('OAuth2ErrorHandlerMiddleware', () => {
  let middleware: OAuth2ErrorHandlerMiddleware;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2ErrorHandlerMiddleware,
        {
          provide: OAuth2orizeSetup,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    middleware = module.get<OAuth2ErrorHandlerMiddleware>(
      OAuth2ErrorHandlerMiddleware,
    );
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
