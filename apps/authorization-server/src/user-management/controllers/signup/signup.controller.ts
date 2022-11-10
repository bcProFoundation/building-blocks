import {
  Controller,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignupViaPhoneCommand } from '../../commands/signup-via-phone/signup-via-phone.command';
import { SignupViaEmailDto, SignupViaPhoneDto, SignupViaEmailNoVerifiedDto } from '../../policies';
import { SignupViaEmailCommand } from '../../commands/signup-via-email/signup-via-email.command';
import { SignupViaEmailNoVerifiedCommand } from '../../commands/signup-via-email-no-verified/signup-via-email-no-verified.command';

@Controller('user_signup')
export class SignupController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('v1/email')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signupViaEmail(@Body() payload: SignupViaEmailDto) {
    return await this.commandBus.execute(new SignupViaEmailCommand(payload));
  }

  @Post('v1/email_no_verified')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signupViaEmailNoVerified(@Body() payload: SignupViaEmailNoVerifiedDto) {
    return await this.commandBus.execute(new SignupViaEmailNoVerifiedCommand(payload));
  }

  @Post('v1/phone')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signupViaPhone(@Body() payload: SignupViaPhoneDto) {
    return await this.commandBus.execute(new SignupViaPhoneCommand(payload));
  }
}
