import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { of } from 'rxjs';
import { BrandController } from './brand.controller';
import { HttpService } from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';

describe('Brand Controller', () => {
  let controller: BrandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [
        { provide: HttpService, useFactory: jest.fn() },
        { provide: CommandBus, useFactory: jest.fn() },
        { provide: QueryBus, useFactory: jest.fn() },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({ canActivate: (...args) => of(true) })
      .compile();

    controller = module.get<BrandController>(BrandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
