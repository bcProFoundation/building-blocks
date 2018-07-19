import * as yargs from 'yargs';

export function createUserCLI(app, AuthService) {
  const args = yargs
    .option('email', {
      alias: 'e',
      describe: 'valid email id for user',
    })
    .option('password', {
      alias: 'p',
      describe: 'password for user',
    })
    .demandOption(
      ['email', 'password'],
      'Please provide both email and password arguments.',
    )
    .help().argv;
  app.then(r => {
    const authService = r.get(AuthService);
    const user: any = {
      email: args.email,
      password: args.password,
    };
    authService.signUp(user).then(() => process.exit());
  });
}

export function createIDPClientCLI(app, ClientService) {
  const args = yargs
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
  app.then(async r => {
    const clientService = r.get(ClientService);
    const client: any = {
      clientSecret: args.secret,
      redirectUri: args.redirect_uri,
      name: args.client,
      isTrusted: 1,
    };
    clientService.save(client).then(() => process.exit());
  });
}
