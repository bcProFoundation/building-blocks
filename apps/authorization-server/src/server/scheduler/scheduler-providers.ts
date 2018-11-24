import { Provider } from '@nestjs/common';
import { TokenSchedulerService } from './token-schedule.service';
import { KeyPairGeneratorService } from './keypair-generator.service';
import { UserDeleteRequestService } from './user-delete-request.service';

class MockTokenSchedulerService {}
class MockKeyPairGeneratorService {}
class MockUserDeleteRequestService {}

export const schedulerProviders: Provider[] = [
  {
    provide: TokenSchedulerService,
    useClass: ['test', 'test-e2e'].includes(process.env.NODE_ENV)
      ? MockTokenSchedulerService
      : TokenSchedulerService,
  },
  {
    provide: KeyPairGeneratorService,
    useClass: ['test', 'test-e2e'].includes(process.env.NODE_ENV)
      ? MockKeyPairGeneratorService
      : KeyPairGeneratorService,
  },
  {
    provide: UserDeleteRequestService,
    useClass: ['test', 'test-e2e'].includes(process.env.NODE_ENV)
      ? MockUserDeleteRequestService
      : UserDeleteRequestService,
  },
];
