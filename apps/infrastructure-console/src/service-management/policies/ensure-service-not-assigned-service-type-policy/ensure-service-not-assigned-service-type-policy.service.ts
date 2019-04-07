import { Injectable, BadRequestException } from '@nestjs/common';
import { ServiceService } from '../../entities/service/service.service';

@Injectable()
export class EnsureServiceNotAssignedServiceTypePolicyService {
  constructor(private readonly service: ServiceService) {}

  async validate(type: string) {
    const servicesAssignedType = await this.service.find({ type });
    if (servicesAssignedType.length > 0) {
      throw new BadRequestException({ servicesAssignedType });
    }
  }
}
