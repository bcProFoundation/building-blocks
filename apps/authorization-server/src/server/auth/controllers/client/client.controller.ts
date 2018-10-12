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

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('create')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async create(@Body() body: CreateClientDto, @Res() res) {
    const client = await this.clientService.save(body);
    delete client._id;
    res.json(client);
  }

  @Post('update')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async update(@Body() payload) {
    const client = await this.clientService.findOne({
      clientId: payload.clientId,
    });
    client.name = payload.name;
    client.clientSecret = payload.clientSecret;
    client.isTrusted = payload.isTrusted;
    client.redirectUris = payload.redirectUris;
    client.save();
  }

  @Get('list')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async list(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    return await this.clientService.paginate(search, {
      offset: Number(offset),
      limit: Number(limit),
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async findOne(@Param('id') id: number, @Req() request) {
    return await this.clientService.findOne({ uuid: id });
  }
}
