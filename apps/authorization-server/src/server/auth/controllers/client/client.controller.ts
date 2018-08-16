import { Controller, UseGuards, Body, Post } from '@nestjs/common';
import { ClientService } from '../../../models/client/client.service';
import { callback } from '../../passport/local.strategy';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateClientDto } from '../../../models/client/create-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('create')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  create(@Body() body: CreateClientDto) {
    this.clientService.save(body);
  }

  @Post('update')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async update(@Body() payload) {
    const client = await this.clientService.findOne(payload.client_id);
    client.name = payload.name;
    client.clientSecret = payload.clientSecret;
    client.isTrusted = payload.isTrusted;
    client.redirectUris = [payload.redirectUri];
    client.save();
  }
}
