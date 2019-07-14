import { Test, TestingModule } from '@nestjs/testing';
import { WellKnownController } from './well-known.controller';
import { WellKnownService } from './well-known.service';

describe('WellKnown Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [WellKnownController],
      providers: [
        {
          provide: WellKnownService,
          useValue: {},
        },
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: WellKnownController = module.get<WellKnownController>(
      WellKnownController,
    );
    expect(controller).toBeDefined();
  });
});
