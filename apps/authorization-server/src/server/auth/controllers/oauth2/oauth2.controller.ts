import {
  Controller,
  Get,
  UseGuards,
  Post,
  Req,
  Render,
  UseFilters,
  Body,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';
import { ErrorFilter } from '../../filters/errors.filter';
import { callback } from '../../passport/local.strategy';
import { Token } from '../../decorators/auth.decorators';
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import {
  OAUTH2_AUTHORIZE_TITLE,
  OAUTH2_AUTHORIZE_DESCRIPTION,
  OAUTH2_TOKEN_TITLE,
  OAUTH2_TOKEN_DESCRIPTION,
  OAUTH2_REVOKE_TITLE,
  OAUTH2_REVOKE_DESCRIPTION,
  OAUTH2_TOKEN_INTROSPECTION_TITLE,
  OAUTH2_TOKEN_INTROSPECTION_DESCRIPTION,
} from '../../../constants/swagger';
import { OAuth2Service } from './oauth2.service';
import { TokenIntrospectionGuard } from '../../guards/token-introspection.guard';

@Controller('oauth2')
export class OAuth2Controller {
  constructor(private readonly oauth2Service: OAuth2Service) {}

  @Get('confirmation')
  @Render('dialog')
  @UseGuards(EnsureLoginGuard)
  @UseFilters(ErrorFilter)
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
    title: OAUTH2_AUTHORIZE_TITLE,
    description: OAUTH2_AUTHORIZE_DESCRIPTION,
  })
  async authorize() {}

  @Post('token')
  @UseGuards(
    AuthGuard(['oauth2-code', 'oauth2-client-password'], {
      session: false,
      callback,
    }),
  )
  @ApiOperation({
    title: OAUTH2_TOKEN_TITLE,
    description: OAUTH2_TOKEN_DESCRIPTION,
  })
  async token() {}

  @Get('profile')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  profile(@Token('user') user) {
    return {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
    };
  }

  @Post('revoke')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  @ApiOperation({
    title: OAUTH2_REVOKE_TITLE,
    description: OAUTH2_REVOKE_DESCRIPTION,
  })
  async tokenRevoke(@Body('token') token) {
    await this.oauth2Service.tokenRevoke(token);
  }

  @Post('introspection')
  @UseGuards(TokenIntrospectionGuard)
  @ApiOperation({
    title: OAUTH2_TOKEN_INTROSPECTION_TITLE,
    description: OAUTH2_TOKEN_INTROSPECTION_DESCRIPTION,
  })
  async tokenIntrospection(@Body('token') token, @Res() res, @Req() req) {
    const tokenData = await this.oauth2Service.tokenIntrospection(token);
    res.json(tokenData);
  }
}
