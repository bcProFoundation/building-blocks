import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ClientService } from '../models/client/client.service';
import { createIDPClientCLI } from 'nestjs-console-connector';
import { Client } from '../models/client/client.entity';

const app = NestFactory.create(AppModule);
const args = createIDPClientCLI();
app.then(async r => {
  const clientService = r.get(ClientService);
  const client = new Client();
  client.clientSecret = args.secret;
  client.redirectUri = args.redirect_uri;
  client.name = args.client;
  client.isTrusted = 1;
  clientService.save(client).then(() => process.exit());
});
