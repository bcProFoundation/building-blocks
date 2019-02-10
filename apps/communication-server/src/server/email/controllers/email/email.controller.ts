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
} from '@nestjs/common';
import { EmailService } from './email.service';
import { AuthServerVerificationGuard } from '../../../auth/guards/authserver-verification.guard';
import { EmailMessageAuthServerDto } from './email-message-authserver-dto';
import { EmailAccountService } from '../../../email/entities/email-account/email-account.service';
import { CreateEmailDto } from './create-email-dto';
import { INDEX_HTML } from '../../../constants/filesystem';
import { EmailListingDto } from './email-listing-dto';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';

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
  @UseGuards(TokenGuard)
  @UsePipes(ValidationPipe)
  async create(@Req() req, @Res() res, @Body() payload: CreateEmailDto) {
    payload.owner = req.token.sub;
    const emailAccount = await this.emailAccount.save(payload);
    delete emailAccount._id;
    res.json(emailAccount);
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async list(@Query() query: EmailListingDto) {
    const skip = Number(query.skip);
    const take = Number(query.take);
    const emailAccounts = await this.emailAccount.list(skip, take);
    return emailAccounts;
  }

  @Post('v1/update')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async update(@Body() payload, @Req() req, @Res() res) {
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
  @UseGuards(TokenGuard)
  async findAll() {
    return await this.emailAccount.findAll();
  }

  @Get('v1/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async findOne(@Param('uuid') uuid: string, @Req() req) {
    return await this.emailService.findOne({ uuid });
  }

  @Get('*')
  wildcard(@Res() res) {
    res.sendFile(INDEX_HTML);
  }
}
