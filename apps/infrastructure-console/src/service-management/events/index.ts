import { ServiceRegisteredHandler } from './service-registered/service-registered.handler';
import { ServiceModifiedHandler } from './service-modified/service-modified.handler';
import { ServiceRemovedHandler } from './service-removed/service-removed.handler';
import { ServiceTypeAddedHandler } from './service-type-added/service-type-added.handler';
import { ServiceTypeRemovedHandler } from './service-type-removed/service-type-removed.handler';

export const ServiceManagementEvents = [
  ServiceRegisteredHandler,
  ServiceModifiedHandler,
  ServiceRemovedHandler,
  ServiceTypeAddedHandler,
  ServiceTypeRemovedHandler,
];
