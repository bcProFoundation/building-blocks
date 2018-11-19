import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
  Get,
  Query,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { AuthServerVerificationGuard } from '../../guards/authserver-verification.guard';
import { EmailMessageAuthServerDto } from './email-message-authserver-dto';
import { EmailAccountService } from '../../models/email-account/email-account.service';
import { CreateEmailDto } from './create-email-dto';
import { BearerTokenStatus } from '../../decorators/bearer-token.decorator';
import { INDEX_HTML } from '../../constants/filesystem';
import { EmailListingDto } from './email-listing-dto';
import { ADMINISTRATOR } from '../../constants/app-strings';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly emailAccount: EmailAccountService,
  ) {}

  @Post('v1/system')
  @UseGuards(AuthServerVerificationGuard)
  @UsePipes(ValidationPipe)
  async sendSystemEmail(@Body() payload: EmailMessageAuthServerDto) {
    return await this.emailService.sendSystemMessage(
      payload.emailTo,
      payload.subject,
      payload.text,
      payload.html,
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

  @Get('v1/list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async list(@Query() query: EmailListingDto, @BearerTokenStatus() token) {
    const skip = Number(query.skip);
    const take = Number(query.take);
    const emailAccounts = await this.emailAccount.list(skip, take);
    return emailAccounts;
  }

  @Post('v1/update')
  async update(
    @Body() payload,
    @Req() req,
    @Res() res,
    @BearerTokenStatus() token,
  ) {
    if (!token.roles.includes(ADMINISTRATOR)) throw new ForbiddenException();
    const existingEmail = await this.emailAccount.findOne({
      uuid: payload.uuid,
    });
    existingEmail.host = payload.host;
    existingEmail.port = payload.port;
    existingEmail.user = payload.user;
    existingEmail.pass = payload.pass;
    existingEmail.from = payload.from;
    await existingEmail.save();
    res.json({
      uuid: existingEmail.uuid,
    });
  }

  @Get('v1/find')
  async findAll() {
    return await this.emailAccount.findAll();
  }

  @Get('v1/:uuid')
  async findOne(
    @Param('uuid') uuid: string,
    @Req() req,
    @BearerTokenStatus() token,
  ) {
    if (!token.roles.includes(ADMINISTRATOR)) throw new ForbiddenException();
    return await this.emailService.findOne({ uuid });
  }

  @Get('*')
  wildcard(@Res() res) {
    res.sendFile(INDEX_HTML);
  }
}
