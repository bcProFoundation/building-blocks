import { EmailRequestService } from './email-request/email-request.service';
import { UserAggregateService } from './user-aggregate/user-aggregate.service';
import { UserManagementService } from './user-management/user-management.service';
import { SignupService } from './signup/signup.service';
import { UserClaimAggregateService } from './user-claim-aggregate/user-claim-aggregate.service';

export const UserManagementAggregates = [
  EmailRequestService,
  UserAggregateService,
  UserManagementService,
  SignupService,
  UserClaimAggregateService,
];
