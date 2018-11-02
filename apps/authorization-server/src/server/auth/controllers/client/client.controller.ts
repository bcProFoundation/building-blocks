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
} from '@nestjs/common';
import { ClientService } from '../../../models/client/client.service';
import { callback } from '../../passport/local.strategy';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateClientDto } from '../../../models/client/create-client.dto';
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
    await this.userService.checkAdministrator(req.user.user);
    const client = await this.clientService.save(body);
    delete client._id;
    res.json(client);
  }

  @Post('v1/update')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async update(@Body() payload, @Req() req) {
    await this.userService.checkAdministrator(req.user.user);
    const client = await this.clientService.findOne({
      clientId: payload.clientId,
    });
    client.name = payload.name;
    client.allowedScopes = payload.allowedScopes;
    client.isTrusted = payload.isTrusted;
    client.redirectUris = payload.redirectUris;
    client.save();
  }

  @Get('v1/list')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async list(
    @Req() req,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    await this.userService.checkAdministrator(req.user.user);
    return await this.clientService.paginate(search, {
      offset: Number(offset),
      limit: Number(limit),
    });
  }

  @Get('v1/:id')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async findOne(@Param('id') id: number, @Req() request) {
    return await this.clientService.findOne({ uuid: id });
  }
}
