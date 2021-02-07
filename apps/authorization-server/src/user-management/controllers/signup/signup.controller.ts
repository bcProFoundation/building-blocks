import {
  Controller,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignupViaPhoneCommand } from '../../commands/signup-via-phone/signup-via-phone.command';
import { SignupViaEmailDto, SignupViaPhoneDto } from '../../policies';
import { SignupViaEmailCommand } from '../../commands/signup-via-email/signup-via-email.command';

@Controller('user_signup')
export class SignupController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('v1/email')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signupViaEmail(@Body() payload: SignupViaEmailDto) {
    return await this.commandBus.execute(new SignupViaEmailCommand(payload));
  }

  @Post('v1/phone')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signupViaPhone(@Body() payload: SignupViaPhoneDto) {
    return await this.commandBus.execute(new SignupViaPhoneCommand(payload));
  }
}
