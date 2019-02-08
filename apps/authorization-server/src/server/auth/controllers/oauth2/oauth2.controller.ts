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
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';
import { ErrorFilter } from '../../../common/filters/errors.filter';
import { callback } from '../../passport/strategies/local.strategy';
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { OAuth2Service } from './oauth2.service';
import { TokenIntrospectionGuard } from '../../../auth/guards/token-introspection.guard';
import { i18n } from '../../../i18n/i18n.config';

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
    title: i18n.__('Authorize'),
    description: i18n.__('Authorize access to resource'),
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
    title: i18n.__('Token'),
    description: i18n.__('OAuth2.0 flow: Return a bearer token'),
  })
  async token() {}

  @Get('profile')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  profile(@Req() req) {
    return this.oauth2Service.getProfile(req);
  }

  @Post('revoke')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  @ApiOperation({
    title: i18n.__('Revoke'),
    description: i18n.__('OAuth2.0 flow: Revoke a token explicitly'),
  })
  async tokenRevoke(@Body('token') token) {
    await this.oauth2Service.tokenRevoke(token);
  }

  @Post('introspection')
  @UseGuards(TokenIntrospectionGuard)
  @ApiOperation({
    title: i18n.__('Introspection'),
    description: i18n.__('Introspect token validity'),
  })
  async tokenIntrospection(@Body('token') token, @Res() res, @Req() req) {
    const tokenData = await this.oauth2Service.tokenIntrospection(token);
    res.json(tokenData);
  }
}
