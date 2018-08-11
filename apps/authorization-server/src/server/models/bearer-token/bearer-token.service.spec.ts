import { Test, TestingModule } from '@nestjs/testing';
import { BearerTokenService } from './bearer-token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BearerToken } from './bearer-token.entity';
import { DocType } from '../base.doctype';

describe('BearerTokenService', () => {
  let service: BearerTokenService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BearerTokenService,
        {
          provide: getRepositoryToken(BearerToken),
          useValue: {}, // use mock values
        },
      ],
    })
      .overrideProvider('DocType')
      .useClass(DocType)
      .compile();
    service = module.get<BearerTokenService>(BearerTokenService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
