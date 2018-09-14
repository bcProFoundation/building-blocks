import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { AuthServerVerificationGuard } from '../../guards/authserver-verification.guard';
import { MessagePattern } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('auth-server')
  @UseGuards(AuthServerVerificationGuard)
  async sendSystemEmail(@Body() setupForm) {
    return await this.emailService.sendMessage();
  }

  @MessagePattern({ cmd: 'sum' })
  sum(data: number[]): Observable<number> {
    // console.log('inside message pattern', {data});
    return from(data);
  }
}
