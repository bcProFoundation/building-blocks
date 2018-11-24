import {
  Controller,
  UseGuards,
  Body,
  Post,
  Get,
  Query,
  Param,
  Req,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import { ClientService } from '../../../models/client/client.service';
import { callback } from '../../passport/local.strategy';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateClientDto } from '../../../models/client/create-client.dto';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { UserService } from '../../../models/user/user.service';

@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly userService: UserService,
  ) {}

  @Post('v1/create')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async create(@Body() body: CreateClientDto, @Req() req, @Res() res) {
    const payload: any = body;
    if (!(await this.userService.checkAdministrator(req.user.user))) {
      payload.isTrusted = 0;
    }
    payload.createdBy = req.user.user;
    payload.creation = new Date();
    const client = await this.clientService.save(payload);
    delete client._id;
    res.json(client);
  }

  @Post('v1/update')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async update(@Body() payload, @Req() req) {
    const client = await this.clientService.findOne({
      clientId: payload.clientId,
    });
    client.name = payload.name;
    client.allowedScopes = payload.allowedScopes;
    client.isTrusted = payload.isTrusted;
    client.redirectUris = payload.redirectUris;
    client.modifiedBy = req.user.user;
    client.modified = new Date();
    await client.save();
  }

  @Get('v1/list')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async list(
    @Req() req,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    const query: { createdBy?: string; name?: RegExp } = {};
    if (search) query.name = new RegExp(search, 'i');
    if (!(await this.userService.checkAdministrator(req.user.user))) {
      query.createdBy = req.user.user;
    }
    return await this.clientService.paginate(query, {
      offset: Number(offset),
      limit: Number(limit),
    });
  }

  @Get('v1/trusted_clients')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async findAllTrustedClients(@Req() req) {
    return await this.clientService.find({ isTrusted: 1 });
  }

  @Get('v1/:uuid')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async findOne(@Param('uuid') uuid: number, @Req() req) {
    let client;
    if (await this.userService.checkAdministrator(req.user.user)) {
      client = await this.clientService.findOne({ uuid });
    } else {
      client = await this.clientService.findOne({
        uuid,
        createdBy: req.user.user,
      });
    }
    if (!client) throw new ForbiddenException();
    return client;
  }
}
