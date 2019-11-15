import { TokenSchedulerService } from './token-schedule/token-schedule.service';
import { KeyPairGeneratorService } from './keypair-generator/keypair-generator.service';
import { AuthDataScheduleService } from './auth-data-schedule/auth-data-schedule.service';
import { AuthCodeSchedulerService } from './auth-code-scheduler/auth-code-scheduler.service';

export { TokenSchedulerService } from './token-schedule/token-schedule.service';
export { KeyPairGeneratorService } from './keypair-generator/keypair-generator.service';
export { AuthDataScheduleService } from './auth-data-schedule/auth-data-schedule.service';

export const AuthSchedulers = [
  TokenSchedulerService,
  KeyPairGeneratorService,
  AuthDataScheduleService,
  AuthCodeSchedulerService,
];
