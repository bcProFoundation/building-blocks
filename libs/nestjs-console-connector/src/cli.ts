import * as yargs from 'yargs';

export function createUserCLI() {
  const args = yargs
    .option('name', {
      alias: 'n',
      describe: 'full name of user',
    })
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
  return args;
}

export function createIDPClientCLI() {
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
  return args;
}
