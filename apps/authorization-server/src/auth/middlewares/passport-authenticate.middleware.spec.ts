import { TestingModule, Test } from '@nestjs/testing';
import { OAuth2orizeSetup } from './oauth2orize.setup';
import { PassportAuthenticateMiddleware } from './passport-authenticate.middleware';

describe('PassportAuthenticateMiddleware', () => {
  let middleware: PassportAuthenticateMiddleware;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassportAuthenticateMiddleware,
        {
          provide: OAuth2orizeSetup,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    middleware = module.get<PassportAuthenticateMiddleware>(
      PassportAuthenticateMiddleware,
    );
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
