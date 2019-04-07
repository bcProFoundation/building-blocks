import { RegisterServiceHandler } from './register-service/register-service.handler';
import { ModifyServiceHandler } from './modify-service/modify-service.handler';
import { RemoveServiceHandler } from './remove-service/remove-service.handler';
import { AddServiceTypeHandler } from './add-service-type/add-service-type.handler';
import { RemoveServiceTypeHandler } from './remove-service-type/remove-service-type.handler';

export const ServiceManagementCommands = [
  RegisterServiceHandler,
  ModifyServiceHandler,
  RemoveServiceHandler,
  AddServiceTypeHandler,
  RemoveServiceTypeHandler,
];
