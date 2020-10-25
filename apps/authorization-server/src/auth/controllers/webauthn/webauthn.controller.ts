import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '../../guards/auth.guard';
import { callback } from '../../passport/strategies/local.strategy';
import { RegisterDeviceDto } from '../../policies/register-device/register-device.dto';
import { RequestWebAuthnKeyRegistrationCommand } from '../../commands/request-webauthn-key-registration/request-webauthn-key-registration.command';
import { RequestLogin } from '../../policies/login-user/request-login.dto';
import { WebAuthnRequestLoginCommand } from '../../commands/webauthn-request-login/webauthn-request-login.command';
import { RegisterWebAuthnKeyCommand } from '../../commands/register-webauthn-key/register-webauthn-key.command';
import { WebAuthnLoginCommand } from '../../commands/webauthn-login/webauthn-login.command';
import { RemoveUserAuthenticatorCommand } from '../../commands/remove-user-authenticator/remove-user-authenticator.command';
import { RenameUserAuthenticatorCommand } from '../../commands/rename-user-authenticator/rename-user-authenticator.command';
import { FindUserAuthenticatorsQuery } from '../../queries/find-user-authenticators/find-user-authenticators.query';

@Controller('webauthn')
export class WebAuthnController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('v1/request_register')
  @UseGuards(AuthGuard('bearer', { callback, session: false }))
  async requestRegister(@Req() req, @Body() body: RegisterDeviceDto) {
    const { userUuid } = body;
    const actorUuid = req.user.user;

    return await this.commandBus.execute(
      new RequestWebAuthnKeyRegistrationCommand(actorUuid, userUuid),
    );
  }

  @Post('v1/register')
  @UseGuards(AuthGuard('bearer', { callback, session: false }))
  async register(@Req() req, @Body() body) {
    const actorUuid = req.user.user;
    return await this.commandBus.execute(
      new RegisterWebAuthnKeyCommand(body, actorUuid),
    );
  }

  @Post('v1/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async login(@Body() body: RequestLogin) {
    return await this.commandBus.execute(
      new WebAuthnRequestLoginCommand(body.username),
    );
  }

  @Post('v1/login_challenge')
  @HttpCode(HttpStatus.OK)
  async loginChallenge(@Req() req) {
    return await this.commandBus.execute(new WebAuthnLoginCommand(req));
  }

  @Get('v1/authenticators/:userUuid')
  @UseGuards(AuthGuard('bearer', { callback, session: false }))
  async findAuthenticators(@Param('userUuid') userUuid: string, @Req() req) {
    const actorUuid = req.user.user;
    return await this.queryBus.execute(
      new FindUserAuthenticatorsQuery(actorUuid, userUuid),
    );
  }

  @Post('v1/remove_authenticator/:uuid')
  @UseGuards(AuthGuard('bearer', { callback, session: false }))
  async removeAuthenticator(
    @Param('uuid') uuid: string,
    @Body('userUuid') userUuid: string,
    @Req() req,
  ) {
    const actorUuid = req.user.user;
    return await this.commandBus.execute(
      new RemoveUserAuthenticatorCommand(uuid, actorUuid, userUuid),
    );
  }

  @Post('v1/rename_authenticator/:uuid')
  @UseGuards(AuthGuard('bearer', { callback, session: false }))
  async renameAuthenticator(
    @Param('uuid') uuid: string,
    @Body('name') name: string,
    @Req() req,
  ) {
    const actorUuid = req.user.user;
    return await this.commandBus.execute(
      new RenameUserAuthenticatorCommand(uuid, name, actorUuid),
    );
  }
}
