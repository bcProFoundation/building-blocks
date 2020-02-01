/* eslint-disable */
import { ServiceClientIdMustBeUniquePolicyService } from './service-client-id-must-be-unique-policy/service-client-id-must-be-unique-policy.service';
import { ServiceTypeNameMustBeUniquePolicyService } from './service-type-name-must-be-unique-policy/service-type-name-must-be-unique-policy.service';
import { ServiceClientIdMustExistPolicyService } from './service-client-id-must-exist-policy/service-client-id-must-exist-policy.service';
import { ServiceTypeNameMustExistPolicyService } from './service-type-name-must-exist-policy/service-type-name-must-exist-policy.service';
import { ClientIdMustExistOnAuthorizationServerPolicyService } from './client-id-must-exist-on-authorization-server-policy';
import { EnsureServiceNotAssignedServiceTypePolicyService } from './ensure-service-not-assigned-service-type-policy';
/* eslint-disable */

export const ServiceManagementPolicies = [
  ServiceClientIdMustBeUniquePolicyService,
  ServiceTypeNameMustBeUniquePolicyService,
  ServiceClientIdMustExistPolicyService,
  ServiceTypeNameMustExistPolicyService,
  ClientIdMustExistOnAuthorizationServerPolicyService,
  EnsureServiceNotAssignedServiceTypePolicyService,
];

/* eslint-disable */
export { ServiceClientIdMustBeUniquePolicyService } from './service-client-id-must-be-unique-policy/service-client-id-must-be-unique-policy.service';
export { ServiceTypeNameMustBeUniquePolicyService } from './service-type-name-must-be-unique-policy/service-type-name-must-be-unique-policy.service';
export { ServiceClientIdMustExistPolicyService } from './service-client-id-must-exist-policy/service-client-id-must-exist-policy.service';
export { ServiceTypeNameMustExistPolicyService } from './service-type-name-must-exist-policy/service-type-name-must-exist-policy.service';
export { ClientIdMustExistOnAuthorizationServerPolicyService } from './client-id-must-exist-on-authorization-server-policy/client-id-must-exist-on-authorization-server-policy.service';
export { EnsureServiceNotAssignedServiceTypePolicyService } from './ensure-service-not-assigned-service-type-policy/ensure-service-not-assigned-service-type-policy.service';
/* eslint-disable */
