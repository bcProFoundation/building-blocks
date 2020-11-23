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
import { Request } from 'express';

import { EmailService } from './email.service';
import { AuthServerVerificationGuard } from '../../../auth/guards/authserver-verification.guard';
import { EmailMessageAuthServerDto } from './email-message-authserver-dto';
import { EmailAccountService } from '../../../email/entities/email-account/email-account.service';
import { CreateEmailDto } from './create-email-dto';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { TokenCache } from '../../../auth/entities/token-cache/token-cache.entity';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly emailAccount: EmailAccountService,
  ) {}

  @Post('v1/system')
  @UseGuards(AuthServerVerificationGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async sendSystemEmail(@Body() payload: EmailMessageAuthServerDto) {
    return await this.emailService.sendSystemMessage(payload);
  }

  @Post('v1/trusted_client')
  @UseGuards(AuthServerVerificationGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async sendTrustedClientEmail(
    @Body() payload: EmailMessageAuthServerDto,
    @Req() request: Request & { token: TokenCache },
  ) {
    return await this.emailService.sendTrustedClientSystemMessage(
      payload,
      request.token,
    );
  }

  @Post('v1/create')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Req() req, @Res() res, @Body() payload: CreateEmailDto) {
    payload.owner = req.token.sub;
    const emailAccount = await this.emailAccount.save(payload);
    delete emailAccount._id;
    res.json(emailAccount);
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  async list(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    const skip = Number(offset);
    const take = Number(limit);
    return await this.emailAccount.list(skip, take);
  }

  @Post('v1/update')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async update(@Body() payload, @Req() req, @Res() res) {
    const existingEmail = await this.emailAccount.findOne({
      uuid: payload.uuid,
    });
    existingEmail.name = payload.name;
    existingEmail.host = payload.host;
    existingEmail.port = payload.port;
    existingEmail.user = payload.user;
    if (payload.pass) existingEmail.pass = payload.pass;
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

  @Get('v1/get/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async findOne(@Param('uuid') uuid: string) {
    const email = await this.emailService.findOne({ uuid });
    email.pass = undefined;
    return email;
  }
}
