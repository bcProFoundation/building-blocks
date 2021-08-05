import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { SetupController } from './setup.controller';

describe('SetupController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SetupController],
      imports: [CqrsModule],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SetupController =
      module.get<SetupController>(SetupController);
    expect(controller).toBeDefined();
  });
});
