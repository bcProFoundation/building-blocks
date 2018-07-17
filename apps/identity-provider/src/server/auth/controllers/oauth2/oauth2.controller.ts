import {
  Controller,
  Get,
  UseGuards,
  Post,
  Req,
  Render,
  UseFilters,
  Body,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { EnsureLoginGuard } from 'nestjs-ensureloggedin-guard';
import { ErrorFilter } from '../../filters/errors.filter';
import { BearerTokenService } from 'models/bearer-token/bearer-token.service';
import { callback } from '../../passport/local.strategy';
import { Token } from '../../guards/auth.decorators';
import { INVALID_TOKEN, TOKEN_NOT_FOUND } from 'constants/messages';

@Controller('oauth2')
export class OAuth2Controller {
  constructor(private readonly bearerTokenService: BearerTokenService) {}

  @Get('confirmation')
  @Render('dialog.hbs')
  @UseGuards(EnsureLoginGuard)
  @UseFilters(ErrorFilter)
  confirmation(@Req() request) {
    return {
      transactionId: request.oauth2.transactionID,
      email: request.user.email,
      client: request.oauth2.client,
    };
  }

  @Post('authorize')
  @UseGuards(EnsureLoginGuard)
  async authorize() {}

  @Post('token')
  @UseGuards(
    AuthGuard(['oauth2-code', 'oauth2-client-password'], {
      session: false,
      callback,
    }),
  )
  async token() {}

  @Get('profile')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  profile(@Token('user') user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  @Post('revoke')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async tokenRevoke(@Body('token') token) {
    const bearerToken = await this.bearerTokenService.findOne({
      accessToken: token,
    });
    if (bearerToken) {
      bearerToken.remove();
    } else {
      throw new HttpException(INVALID_TOKEN, HttpStatus.NOT_FOUND);
    }
  }

  @Post('introspection')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async tokenIntrospection(@Body() body, @Res() res) {
    const bearerToken = await this.bearerTokenService.findOne({
      accessToken: body.token,
    });

    if (!bearerToken) {
      throw new HttpException(TOKEN_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const exp = new Date(
      bearerToken.creation.getTime() + bearerToken.expiresIn * 1000,
    );

    const tokenData: any = {
      client_id: bearerToken.client.id,
      active: exp.valueOf() > new Date().valueOf(),
      exp: exp.valueOf(),
    };

    if (bearerToken.user && bearerToken.user.id)
      tokenData.username = bearerToken.user.email;
    if (bearerToken.scope) tokenData.scope = bearerToken.scope;

    res.json(tokenData);
  }
}
