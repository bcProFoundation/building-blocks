import {
  Controller,
  UseGuards,
  Body,
  Post,
  Get,
  Query,
  Param,
  Req,
  SerializeOptions,
  UsePipes,
  ValidationPipe,
  Headers,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { callback } from '../../../auth/passport/strategies/local.strategy';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { CreateClientDto } from '../../entities/client/create-client.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMINISTRATOR, AUTHORIZATION } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { RemoveOAuth2ClientCommand } from '../../commands/remove-oauth2client/remove-oauth2client.command';
import { AddClientCommand } from '../../commands/add-client/add-client.command';
import { ModifyClientCommand } from '../../commands/modify-client/modify-client.command';
import { UpdateClientSecretCommand } from '../../commands/update-client-secret/update-client-secret.command';
import { VerifyChangedClientSecretCommand } from '../../commands/verify-changed-client-secret/verify-changed-client-secret.command';
import { GetClientByUuidQuery } from '../../queries/get-client-by-uuid/get-client-by-uuid.query';
import { GetClientByClientIdQuery } from '../../queries/get-client-by-client-id/get-client-by-client-id.query';
import { GetTrustedClientsQuery } from '../../queries/get-trusted-clients/get-trusted-clients.query';
import { ListClientsQuery } from '../../queries/list-clients/list-clients.query';
import { ListQueryDto } from '../../../common/policies/list-query/list-query';

@Controller('client')
@SerializeOptions({ excludePrefixes: ['_'] })
export class ClientController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('v1/create')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async create(@Body() body: CreateClientDto, @Req() req) {
    const actorUuid = req.user.user;
    return await this.commandBus.execute(new AddClientCommand(actorUuid, body));
  }

  @Post('v1/update/:clientId')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async update(
    @Body() payload: CreateClientDto,
    @Param('clientId') clientId: string,
    @Req() req,
  ) {
    const actorUuid = req.user.user;
    return await this.commandBus.execute(
      new ModifyClientCommand(actorUuid, clientId, payload),
    );
  }

  @Post('v1/update_secret/:clientId')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async updateSecret(@Param('clientId') clientId: string, @Req() req) {
    const userUuid = req.user.user;
    return await this.commandBus.execute(
      new UpdateClientSecretCommand(clientId, userUuid),
    );
  }

  @Post('v1/verify_changed_secret')
  async verifyChangedSecret(@Headers(AUTHORIZATION) authorization) {
    return await this.commandBus.execute(
      new VerifyChangedClientSecretCommand(authorization),
    );
  }

  @Get('v1/list')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async list(@Query() query: ListQueryDto, @Req() req) {
    const { offset, limit, search, sort } = query;
    const userUuid = req.user.user;
    return await this.queryBus.execute(
      new ListClientsQuery(userUuid, offset, limit, search, sort),
    );
  }

  @Get('v1/trusted_clients')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async findAllTrustedClients() {
    return await this.queryBus.execute(new GetTrustedClientsQuery());
  }

  @Get('v1/get/:uuid')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async findOne(@Param('uuid') uuid: string, @Req() req) {
    const userUuid = req.user.user;
    return await this.queryBus.execute(
      new GetClientByUuidQuery(uuid, userUuid),
    );
  }

  @Get('v1/get_by_client_id/:clientId')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async getClientId(@Param('clientId') clientId: string, @Req() req) {
    const userUuid = req.user.user;
    return await this.queryBus.execute(
      new GetClientByClientIdQuery(clientId, userUuid),
    );
  }

  @Post('v1/delete/:clientId')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async deleteByUUID(@Param('clientId') clientId, @Req() req) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new RemoveOAuth2ClientCommand(actorUserUuid, clientId),
    );
  }
}
