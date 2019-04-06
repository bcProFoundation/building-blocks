import { Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '../../entities/service/service.entity';
import { ServiceService } from '../../entities/service/service.service';

@Injectable()
export class ServiceClientIdMustExistPolicyService {
  private existingService: Service;

  constructor(private readonly service: ServiceService) {}

  async validate(clientId: string) {
    this.existingService = await this.service.findOne({ clientId });
    if (!this.existingService) {
      throw new NotFoundException({ clientId });
    }
    return this.existingService;
  }
}
