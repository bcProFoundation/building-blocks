import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { Service } from '../../entities/service/service.entity';
import { ServiceRegisteredEvent } from '../../events/service-registered/service-registered.event';
import { ServiceRemovedEvent } from '../../events/service-removed/service-removed.event';
import { ServiceModifiedEvent } from '../../events/service-modified/service-modified.event';
import { ModifyServiceDto } from '../../policies/modify-service/modify-service.dto';
import { ServiceTypeAddedEvent } from '../../events/service-type-added/service-type-added.event';
import { ServiceTypeValidationDto } from '../../policies/service-type-validation/service-type-validation.dto';
import { ServiceTypeRemovedEvent } from '../../events/service-type-removed/service-type-removed.event';
import { ServiceType } from '../../entities/service-type/service-type.entity';
import { CreateServiceDto } from '../../policies/create-service/create-service.dto';
import {
  ServiceClientIdMustBeUniquePolicyService,
  ServiceTypeNameMustBeUniquePolicyService,
  ServiceClientIdMustExistPolicyService,
  ServiceTypeNameMustExistPolicyService,
  ClientIdMustExistOnAuthorizationServerPolicyService,
  EnsureServiceNotAssignedServiceTypePolicyService,
} from '../../policies';
import { TokenCache } from '../../../auth/entities/token-cache/token-cache.entity';

@Injectable()
export class ServiceAggregateService extends AggregateRoot {
  constructor(
    private readonly serviceClientIdMustBeUnique: ServiceClientIdMustBeUniquePolicyService,
    private readonly serviceTypeNameMustBeUnique: ServiceTypeNameMustBeUniquePolicyService,
    private readonly serviceClientIdMustExist: ServiceClientIdMustExistPolicyService,
    private readonly serviceTypeNameMustExist: ServiceTypeNameMustExistPolicyService,
    private readonly clientIdMustExistOnAuthorizationServer: ClientIdMustExistOnAuthorizationServerPolicyService,
    private readonly ensureServiceNotAssignedServiceType: EnsureServiceNotAssignedServiceTypePolicyService,
  ) {
    super();
  }

  async addService(payload: CreateServiceDto, token: TokenCache) {
    // trim and make lowercase
    payload.name = payload.name.trim().toLowerCase();

    // check existing
    await this.serviceClientIdMustBeUnique.validate(payload.clientId);
    await this.serviceTypeNameMustExist.validate(payload.type);
    await this.clientIdMustExistOnAuthorizationServer.validate(
      payload.clientId,
      token,
    );
    const service = new Service();
    service.uuid = uuidv4();
    Object.assign(service, payload);

    this.apply(new ServiceRegisteredEvent(service));
  }

  async removeService(clientId: string) {
    const service = await this.serviceClientIdMustExist.validate(clientId);
    this.apply(new ServiceRemovedEvent(service));
  }

  async modifyService(clientId: string, payload: ModifyServiceDto) {
    const service = await this.serviceClientIdMustExist.validate(clientId);
    await this.ensureServiceNotAssignedServiceType.validate(payload.name);
    await this.serviceTypeNameMustExist.validate(payload.type);

    Object.assign(service, payload);
    this.apply(new ServiceModifiedEvent(service));
  }

  async addServiceType(payload: ServiceTypeValidationDto) {
    // trim and make lowercase
    payload.name = payload.name.trim().toLowerCase();

    await this.serviceTypeNameMustBeUnique.validate(payload.name);

    const serviceType = new ServiceType();
    serviceType.uuid = uuidv4();
    Object.assign(serviceType, payload);

    this.apply(new ServiceTypeAddedEvent(serviceType));
  }

  async removeServiceType(name: string) {
    const serviceType = await this.serviceTypeNameMustExist.validate(name);
    await this.ensureServiceNotAssignedServiceType.validate(name);
    this.apply(new ServiceTypeRemovedEvent(serviceType));
  }
}
