import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { SignupController } from './signup.controller';

describe('RoleController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SignupController],
      providers: [
        {
          provide: CommandBus,
          useValue: {},
        },
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SignupController =
      module.get<SignupController>(SignupController);
    expect(controller).toBeDefined();
  });
});
