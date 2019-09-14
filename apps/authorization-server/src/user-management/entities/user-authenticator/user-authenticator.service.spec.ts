import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthenticatorService } from './user-authenticator.service';
import { USER_AUTHENTICATOR } from './user-authenticator.schema';

describe('UserAuthenticatorService', () => {
  let service: UserAuthenticatorService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthenticatorService,
        {
          provide: USER_AUTHENTICATOR,
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<UserAuthenticatorService>(UserAuthenticatorService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
