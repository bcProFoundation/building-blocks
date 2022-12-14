import {
  Controller,
  Get,
  UseGuards,
  Post,
  Req,
  Render,
  UseFilters,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { EnsureLoginGuard } from '../../guards/ensure-login.guard';
import { ErrorFilter } from '../../../common/filters/errors.filter';
import { OAuth2Service } from './oauth2.service';
import { BasicClientCredentialsGuard } from '../../guards/basic-client-credentials.guard';
import { i18n } from '../../../i18n/i18n.config';
import { BearerTokenGuard } from '../../guards/bearer-token.guard';

@Controller('oauth2')
export class OAuth2Controller {
  constructor(private readonly oauth2Service: OAuth2Service) {}

  @Get('confirmation')
  @Render('dialog')
  @UseGuards(EnsureLoginGuard)
  @UseFilters(new ErrorFilter())
  @ApiExcludeEndpoint()
  confirmation(@Req() request) {
    return {
      transactionId: request.oauth2.transactionID,
      email: request.user.email,
      client: request.oauth2.client,
      action: '/oauth2/authorize',
    };
  }

  @Post('authorize')
  @UseGuards(EnsureLoginGuard)
  @ApiOperation({
    summary: i18n.__('Authorize'),
    description: i18n.__('Authorize access to resource'),
  })
  async authorize() {}

  @Post('token')
  @ApiOperation({
    summary: i18n.__('Token'),
    description: i18n.__('OAuth2.0 flow: Return a bearer token'),
  })
  token() {}

  @Get('profile')
  @UseGuards(BearerTokenGuard)
  profile(@Req() req) {
    return this.oauth2Service.getProfile(req);
  }

  @Post('revoke')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BasicClientCredentialsGuard)
  @ApiOperation({
    summary: i18n.__('Revoke'),
    description: i18n.__('OAuth2.0 flow: Revoke a token explicitly'),
  })
  async tokenRevoke(@Body('token') token) {
    return await this.oauth2Service.tokenRevoke(token);
  }

  @Post('introspection')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BasicClientCredentialsGuard)
  @ApiOperation({
    summary: i18n.__('Introspection'),
    description: i18n.__('Introspect token validity'),
  })
  async tokenIntrospection(@Body('token') token) {
    return await this.oauth2Service.tokenIntrospection(token);
  }
}
