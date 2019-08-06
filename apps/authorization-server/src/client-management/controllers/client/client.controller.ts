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
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { callback } from '../../../auth/passport/strategies/local.strategy';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { CreateClientDto } from '../../../client-management/entities/client/create-client.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { UserService } from '../../../user-management/entities/user/user.service';
import { CRUDOperationService } from '../../../common/services/crudoperation/crudoperation.service';
import { randomBytes32 } from '../../../client-management/entities/client/client.schema';
import { RemoveOAuth2ClientCommand } from '../../../client-management/commands/remove-oauth2client/remove-oauth2client.command';
import { AddClientCommand } from '../../../client-management/commands/add-client/add-client.command';
import { ModifyClientCommand } from '../../../client-management/commands/modify-client/modify-client.command';

@Controller('client')
@SerializeOptions({ excludePrefixes: ['_'] })
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly crudService: CRUDOperationService,
    private readonly commandBus: CommandBus,
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
    const client = await this.clientService.findOne({ clientId });
    if (
      (await this.userService.checkAdministrator(req.user.user)) ||
      client.createdBy === req.user.user
    ) {
      client.changedClientSecret = randomBytes32();
      client.modifiedBy = req.user.user;
      client.modified = new Date();
      await client.save();
      return client;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Post('v1/verify_changed_secret')
  async verifyChangedSecret(@Req() req) {
    return await this.clientService.verifyChangedSecret(req);
  }

  @Get('v1/list')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async list(
    @Req() req,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    const query: { createdBy?: string } = {};

    if (!(await this.userService.checkAdministrator(req.user.user))) {
      query.createdBy = req.user.user;
    }

    const sortQuery = { name: sort };
    return this.crudService.listPaginate(
      this.clientService.getModel(),
      offset,
      limit,
      search,
      query,
      ['name', 'clientId'],
      sortQuery,
    );
  }

  @Get('v1/trusted_clients')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async findAllTrustedClients(@Req() req) {
    return await this.clientService.find({ isTrusted: 1 });
  }

  @Get('v1/get/:uuid')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async findOne(@Param('uuid') uuid: string, @Req() req) {
    let client;
    if (await this.userService.checkAdministrator(req.user.user)) {
      client = await this.clientService.findOne({ uuid });
    } else {
      client = await this.clientService.findOne({
        uuid,
        createdBy: req.user.user,
      });
    }
    if (!client) throw new NotFoundException({ uuid });
    return client;
  }

  @Get('v1/get_by_client_id/:clientId')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async getClientId(@Param('clientId') clientId: string, @Req() req) {
    let client;
    if (await this.userService.checkAdministrator(req.user.user)) {
      client = await this.clientService.findOne({ clientId });
    } else {
      client = await this.clientService.findOne({
        clientId,
        createdBy: req.user.user,
      });
    }
    if (!client) throw new NotFoundException({ clientId });
    return client;
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
