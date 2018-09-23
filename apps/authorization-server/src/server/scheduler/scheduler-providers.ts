import { Provider } from '@nestjs/common';
import { TokenSchedulerService } from './token-schedule.service';
import { KeyPairGeneratorService } from './keypair-generator.service';

class MockTokenSchedulerService {}
class MockKeyPairGeneratorService {}

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
];
