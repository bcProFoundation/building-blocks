import {
  Controller,
  Body,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupViaEmailDto } from '../../../user-management/entities/user/signup-via-email.dto';

@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post('v1/email')
  @UsePipes(ValidationPipe)
  signupViaEmail(@Body() payload: SignupViaEmailDto, @Res() res) {
    payload.email = payload.email.trim().toLocaleLowerCase();
    return this.signupService.initSignup(payload, res);
  }
}
