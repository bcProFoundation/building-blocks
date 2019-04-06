import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceType } from '../../entities/service-type/service-type.entity';
import { ServiceTypeService } from '../../entities/service-type/service-type.service';

@Injectable()
export class ServiceTypeNameMustExistPolicyService {
  private existingServiceType: ServiceType;

  constructor(private readonly serviceType: ServiceTypeService) {}

  async validate(name: string) {
    this.existingServiceType = await this.serviceType.findOne({ name });
    if (!this.existingServiceType) {
      throw new NotFoundException({ name });
    }
    return this.existingServiceType;
  }
}
