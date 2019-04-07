import { Injectable, BadRequestException } from '@nestjs/common';
import { ServiceService } from '../../entities/service/service.service';
import { Service } from '../../entities/service/service.entity';

@Injectable()
export class ServiceClientIdMustBeUniquePolicyService {
  private existingService: Service;

  constructor(private readonly service: ServiceService) {}

  async validate(clientId: string) {
    this.existingService = await this.service.findOne({ clientId });
    if (this.existingService) {
      throw new BadRequestException({
        existingService: this.existingService,
      });
    }
  }
}
