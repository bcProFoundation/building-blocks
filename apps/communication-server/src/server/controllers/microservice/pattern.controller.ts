import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SEND_EMAIL } from '../../constants/app-strings';
import { MicroservicePatternService } from './pattern.service';

@Controller()
export class MicroservicePatternController {
  constructor(private readonly patternService: MicroservicePatternService) {}
  @MessagePattern({ cmd: SEND_EMAIL })
  async systemEmail(data: any) {
    return await this.patternService.processMessage(data);
  }
}
