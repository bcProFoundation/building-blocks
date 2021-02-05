import {
  Controller,
  Body,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignupService } from '../../aggregates/signup/signup.service';
import { SignupViaEmailDto, SignupViaPhoneDto } from '../../policies';

@Controller('user_signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post('v1/email')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signupViaEmail(@Body() payload: SignupViaEmailDto, @Res() res) {
    await this.signupService.validateSignupEnabled();
    payload.email = payload.email.trim().toLocaleLowerCase();
    res.json(await this.signupService.initSignup(payload, res));
  }

  @Post('v1/phone')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signupViaPhone(@Body() payload: SignupViaPhoneDto) {
    await this.signupService.validateSignupEnabled();
    return await this.signupService.initSignupViaPhone(payload);
  }
}
