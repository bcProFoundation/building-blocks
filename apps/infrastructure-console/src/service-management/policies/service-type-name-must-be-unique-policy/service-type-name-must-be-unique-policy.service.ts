import { Injectable, BadRequestException } from '@nestjs/common';
import { ServiceType } from '../../entities/service-type/service-type.entity';
import { ServiceTypeService } from '../../entities/service-type/service-type.service';

@Injectable()
export class ServiceTypeNameMustBeUniquePolicyService {
  private existingServiceType: ServiceType;

  constructor(private readonly serviceType: ServiceTypeService) {}

  async validate(name: string) {
    this.existingServiceType = await this.serviceType.findOne({ name });
    if (this.existingServiceType) {
      throw new BadRequestException({
        existingServiceType: this.existingServiceType,
      });
    }
  }
}
