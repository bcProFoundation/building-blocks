import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SEND_EMAIL } from '../../../constants/app-strings';
import { SendEmailService } from './send-email.service';

@Controller()
export class SendEmailController {
  constructor(private readonly patternService: SendEmailService) {}
  @MessagePattern({ cmd: SEND_EMAIL })
  async systemEmail(data: any) {
    return await this.patternService.processMessage(data);
  }
}
