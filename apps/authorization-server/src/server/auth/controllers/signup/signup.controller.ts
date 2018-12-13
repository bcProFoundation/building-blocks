import {
  Controller,
  Body,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupViaEmailDto } from '../../../models/user/signup-via-email.dto';
import { VerifyEmailDto } from '../../../models/user/verify-email.dto';

@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post('v1/email')
  @UsePipes(ValidationPipe)
  signupViaEmail(@Body() payload: SignupViaEmailDto, @Res() res) {
    payload.email = payload.email.trim().toLocaleLowerCase();
    return this.signupService.initSignup(payload, res);
  }

  @Post('v1/verify')
  @UsePipes(ValidationPipe)
  async verifyEmail(@Body() payload: VerifyEmailDto, @Res() res) {
    const verifyEmailResponse = await this.signupService.verifyEmail(
      payload,
      res,
    );
    res.json(verifyEmailResponse);
  }
}