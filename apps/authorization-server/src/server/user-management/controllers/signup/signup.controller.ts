import {
  Controller,
  Body,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignupService } from '../../aggregates/signup/signup.service';
import { SignupViaEmailDto } from '../../policies';

@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post('v1/email')
  @UsePipes(ValidationPipe)
  async signupViaEmail(@Body() payload: SignupViaEmailDto, @Res() res) {
    await this.signupService.validateSignupEnabled();
    payload.email = payload.email.trim().toLocaleLowerCase();
    res.json(await this.signupService.initSignup(payload, res));
  }
}
