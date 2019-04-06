import { ListServicesHandler } from './list-services/list-services.handler';
import { GetServiceByClientIdHandler } from './get-service-by-clientid/get-service-by-clientid.handler';
import { GetServiceTypeByNameHandler } from './get-service-type-by-name/get-service-type-by-name.handler';
import { ListServiceTypesHandler } from './list-service-types/list-service-types.handler';
import { GetServiceTypeByUuidHandler } from './get-service-type-by-uuid/get-service-type-by-uuid.handler';
import { GetServiceByUuidHandler } from './get-service-by-uuid/get-service-by-uuid.handler';

export const ServiceManagementQueries = [
  ListServicesHandler,
  ListServiceTypesHandler,
  GetServiceByClientIdHandler,
  GetServiceTypeByNameHandler,
  GetServiceTypeByUuidHandler,
  GetServiceByUuidHandler,
];
