import { Test, TestingModule } from '@nestjs/testing';
import { ClientIdMustExistOnAuthorizationServerPolicyService } from './client-id-must-exist-on-authorization-server-policy.service';
import { HttpModule } from '@nestjs/axios';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

describe('ClientIdMustExistOnAuthorizationServerPolicyService', () => {
  let service: ClientIdMustExistOnAuthorizationServerPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        ClientIdMustExistOnAuthorizationServerPolicyService,
        { provide: ServerSettingsService, useValue: {} },
      ],
    }).compile();

    service = module.get<ClientIdMustExistOnAuthorizationServerPolicyService>(
      ClientIdMustExistOnAuthorizationServerPolicyService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
