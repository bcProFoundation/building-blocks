import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { AuthServerVerificationGuard } from '../../guards/authserver-verification.guard';
import { EmailMessageAuthServerDto } from './email-message-authserver-dto';
import { EmailAccountService } from '../../models/email-account/email-account.service';
import { CreateEmailDto } from './create-email-dto';
import { BearerTokenStatus } from '../../decorators/bearer-token.decorator';

@Controller('email')
export class EmailController {
  constructor(
    private readonly email: EmailService,
    private readonly emailAccount: EmailAccountService,
  ) {}

  @Post('v1/system')
  @UseGuards(AuthServerVerificationGuard)
  @UsePipes(ValidationPipe)
  async sendSystemEmail(@Body() payload: EmailMessageAuthServerDto) {
    return await this.email.sendSystemMessage(
      payload.emailTo,
      payload.subject,
      payload.text,
      payload.html,
      payload.emailAccount,
    );
  }

  @Post('v1/create')
  @UsePipes(ValidationPipe)
  async create(
    @Req() req,
    @Res() res,
    @Body() payload: CreateEmailDto,
    @BearerTokenStatus() token,
  ) {
    payload.owner = token.sub;
    const emailAccount = await this.emailAccount.save(payload);
    delete emailAccount._id;
    res.json(emailAccount);
  }
}
