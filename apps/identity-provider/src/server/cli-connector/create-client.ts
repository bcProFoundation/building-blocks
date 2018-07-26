import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ClientService } from '../models/client/client.service';
import { Client } from '../models/client/client.entity';
import * as yargs from 'yargs';

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

function createIDPClientCLI() {
  return yargs
    .option('client', {
      alias: 'c',
      describe: 'client name',
    })
    .option('redirect_uri', {
      alias: 'r',
      describe: 'redirect_uri for client',
    })
    .option('secret', {
      alias: 's',
      describe: 'client_secret for client',
    })
    .demandOption(
      ['client', 'redirect_uri', 'secret'],
      'Please provide client name, redirect_uri and secret arguments.',
    )
    .help().argv;
}
